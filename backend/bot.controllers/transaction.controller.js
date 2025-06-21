const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const { DateTime } = require("luxon");

class TransactionController {
  constructor(handler) {
    this.handler = handler;
    this.CURRENCIES = ["INR", "USD", "EUR", "GBP"];
    this.CATEGORIES = [
      "Food",
      "Transport",
      "Housing",
      "Entertainment",
      "Utilities",
      "Other",
    ];
    this.itemsPerPage = 5;
  }

  async startAddExpense(user) {
    user.currState = "TRANSACTION:ADD_CURRENCY";
    await user.save();
    this.handler.sendMessage(
      user.chatId,
      "💰 Select currency:",
      this.handler.createKeyboard([...this.CURRENCIES, "Back", "Main Menu"])
    );
  }

  async handleInput(user, text) {
    const [, step] = user.currState.split(":");
    const handlers = {
      ADD_CURRENCY: () => this.handleCurrency(user, text),
      ADD_AMOUNT: () => this.handleAmount(user, text),
      ADD_DESCRIPTION: () => this.handleDescription(user, text),
      ADD_CATEGORY: () => this.handleCategory(user, text),
    };
    return handlers[step]?.();
  }

  async handleCurrency(user, text) {
    if (!this.CURRENCIES.includes(text.toUpperCase())) {
      return this.handler.sendMessage(
        user.chatId,
        "⚠️ Invalid currency",
        this.handler.createKeyboard([...this.CURRENCIES, "Back"])
      );
    }
    user.inProgressData.currency = text.toUpperCase();
    user.currState = "TRANSACTION:ADD_AMOUNT";
    await user.save();
    this.handler.sendMessage(
      user.chatId,
      "💵 Enter amount:",
      this.handler.getCancelKeyboard()
    );
  }

  async handleAmount(user, text) {
    if (!this.handler.validateAmount(text)) {
      return this.handler.sendMessage(
        user.chatId,
        "⚠️ Invalid amount",
        this.handler.getCancelKeyboard()
      );
    }
    user.inProgressData = { ...user.inProgressData, amount: parseFloat(text) };
    user.markModified("inProgressData");
    user.currState = "TRANSACTION:ADD_DESCRIPTION";
    await user.save();
    this.handler.sendMessage(
      user.chatId,
      "📝 Enter description:",
      this.handler.getCancelKeyboard()
    );
  }

     async startEditExpense(user) {
    user.currState = "TRANSACTION:EDIT_PERIOD_SELECT";
    await user.save();
    const keyboard = {
      keyboard: [
        ["Last Month", "Last 6 Months"],
        ["Last Year", "All Time"],
        ["/main"],
      ],
      resize_keyboard: true,
    };
    this.handler.sendMessage(user.chatId, "📅 Select time period:", keyboard);
  }

  getDateRange(period) {
    const now = DateTime.now();
    console.log(period, "dsf");
    switch (period) {
      case "last month":
        return {
          start: now.minus({ months: 1 }).startOf("month").toJSDate(),
          end: now.minus({ months: 1 }).endOf("month").toJSDate(),
        };
      case "last 6 months":
        return {
          start: now.minus({ months: 6 }).startOf("month").toJSDate(),
          end: now.endOf("day").toJSDate(),
        };
      case "last year":
        return {
          start: now.minus({ years: 1 }).startOf("year").toJSDate(),
          end: now.endOf("year").toJSDate(),
        };
      case "all time":
        return {
          start: new Date(0),
          end: now.endOf("day").toJSDate(),
        };
      default:
        return null;
    }
  }

  async handleInput(user, text) {
    const [_, state] = user.currState.split(":");

    if (state === "EDIT_PERIOD_SELECT") {
      const range = this.getDateRange(text);
      if (!range) {
        return this.handler.sendMessage(
          user.chatId,
          "⚠️ Invalid period. Use buttons.",
          this.handler.getMainKeyboard()
        );
      }

      user.inProgressData = {
        editPeriod: text,
        startDate: range.start,
        endDate: range.end,
        currentPage: 1,
      };
      user.currState = "TRANSACTION:EDIT_SELECT";
      await user.save();
      await this.showEditPage(user);
    } else if (state === "EDIT_SELECT") {
      const selectedIndex = text.toLowerCase().trim();

      
      if (selectedIndex.includes("next")) return this.handlePagination(user, "next");
      if (selectedIndex.includes("prev")) return this.handlePagination(user, "prev");

      const index = selectedIndex.charCodeAt(0) - 97; // 'a' to 0
      const txns = user.inProgressData.transactions;
      if (index < 0 || index >= txns.length) {
        return this.handler.sendMessage(
          user.chatId,
          "⚠️ Invalid selection. Choose from buttons (a–e)."
        );
      }

      const txn = txns[index];
      console.log(txns, "priting haa haa");
      user.inProgressData.selectedTxnId = txn._id;
      user.inProgressData.tempDescription = ""; // optional init
      user.inProgressData.tempAmount = null;
      user.prevStateBeforeEdit = user.currState;
      user.currState = "TRANSACTION:EDIT_DESCRIPTION";
      user.markModified("inProgressData");
      await user.save();

      // Pause Gemini temporarily
      // await user.save();
      console.log(user, "testing user");

      return this.handler.sendMessage(user.chatId, "✏️ Enter new description:");
    } else if (state === "EDIT_DESCRIPTION") {
        console.log(user, "edit desciption");
        user.inProgressData.tempDescription = text;
        user.currState = "TRANSACTION:EDIT_AMOUNT";
        user.markModified("inProgressData");
        await user.save();
        return this.handler.sendMessage(user.chatId, "💰 Enter new amount:");
    }
    else if (state === "EDIT_AMOUNT") {
      const amount = parseFloat(text);
      if (isNaN(amount) || amount <= 0) {
        return this.handler.sendMessage(user.chatId, "⚠️ Enter a valid amount (number > 0):");
      }

      const txn = await Transaction.findById(user.inProgressData.selectedTxnId);
      if (!txn) {
        return this.handler.sendMessage(user.chatId, "❌ Transaction not found.");
      }

      txn.description = user.inProgressData.tempDescription;
      txn.amount = amount;
      await txn.save();

      await this.handler.sendMessage(user.chatId, "✅ Description and amount updated!");
      await this.handler.resetUserState(user);
    }

  }

  async showEditPage(user) {
    const { startDate, endDate, currentPage } = user.inProgressData;
    const skip = (currentPage - 1) * this.itemsPerPage;

    const txns = await Transaction.find({
      createdBy: user._id,
      date: { $gte: startDate, $lte: endDate },
    })
      .sort({ date: -1 })
      .skip(skip)
      .limit(this.itemsPerPage)
      .lean();

    if (!txns.length) {
      await this.handler.sendMessage(
        user.chatId,
        "📭 No transactions to edit.",
        this.handler.getMainKeyboard()
      );
      return this.handler.resetUserState(user);
    }

    user.inProgressData.transactions = txns;
    user.markModified("inProgressData");
    await user.save();

    let msg = `📝 Select transaction to edit (Page ${currentPage}):\n\n`;
    const buttons = [];
    txns.forEach((t, i) => {
      msg += `${String.fromCharCode(97 + i)}. ${t.description} — ₹${t.amount}\n`;
      buttons.push([{ text: String.fromCharCode(97 + i) }]);
    });

    buttons.push([{ text: "⬅️ Prev" }, { text: "➡️ Next" }]);
    buttons.push([{ text: "/main" }]);

    await this.handler.sendMessage(user.chatId, msg, {
      keyboard: buttons,
      resize_keyboard: true,
    });
  }

  async handlePagination(user, direction) {
    const page = user.inProgressData.currentPage;
    user.inProgressData.currentPage =
      direction === "next" ? page + 1 : Math.max(1, page - 1);
    user.markModified("inProgressData");
    await user.save();
    return this.showEditPage(user);
  }

  async handleBack(user) {
    if (user.currState.startsWith("TRANSACTION:EDIT")) {
      return this.startEditExpense(user);
    }
    await this.handler.resetUserState(user);
    return this.handler.showMainMenu(user.chatId);
  }




  async handleDescription(user, text) {
    user.inProgressData = { ...user.inProgressData, description: text };
    user.markModified("inProgressData");
    user.currState = "TRANSACTION:ADD_CATEGORY";
    await user.save();
    this.handler.sendMessage(
      user.chatId,
      "📦 Select category:",
      this.handler.createKeyboard([...this.CATEGORIES, "Back"])
    );
  }

  async handleCategory(user, text) {
    if (!this.CATEGORIES.some((c) => c.toLowerCase() === text.toLowerCase())) {
      return this.handler.sendMessage(
        user.chatId,
        "⚠️ Invalid category",
        this.handler.createKeyboard([...this.CATEGORIES, "Back"])
      );
    }
    user.inProgressData.category = text;
    await this.finalizeExpense(user);
  }

  async finalizeExpense(user) {
    try {
      const transaction = new Transaction({
        ...user.inProgressData,
        createdBy: user._id,
        date: new Date(),
        type: "expense",
        splitType: "personal",
      });
      await transaction.save();
      user.transactions.push(transaction._id);
      await user.save();
      this.handler.sendMessage(
        user.chatId,
        `✅ Expense of ${transaction.amount} ${transaction.currency} recorded!`,
        this.handler.getMainKeyboard()
      );
      this.handler.resetUserState(user);
    } catch (error) {
      logger.error("Expense creation failed:", error);
      this.handler.sendMessage(
        user.chatId,
        `❌ Error saving expense: ${error.message}`,
        this.handler.getMainKeyboard()
      );
    }
  }

  async handleBack(user) {
    const [, step] = user.currState.split(":");
    const backSteps = {
      ADD_CURRENCY: null,
      ADD_AMOUNT: "TRANSACTION:ADD_CURRENCY",
      ADD_DESCRIPTION: "TRANSACTION:ADD_AMOUNT",
      ADD_CATEGORY: "TRANSACTION:ADD_DESCRIPTION",
    };
    user.currState = backSteps[step] || "";
    await user.save();
    this.handler.showCurrentMenu(user);
  }
}

module.exports = TransactionController;
