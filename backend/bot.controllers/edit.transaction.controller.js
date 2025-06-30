const Transaction = require("../models/transaction.model");
const User = require("../models/user.model");
const { DateTime } = require("luxon");

class EditTransactionController  {
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

   async startEditExpense(user) {
    user.currState = "EDIT:EDIT_PERIOD_SELECT";
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
    //  console.log("ra ram ");

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
      user.currState = "EDIT:EDIT_SELECT";
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
      user.inProgressData.tempType = "";
      user.inProgressData.tempCategory = "";
      user.prevStateBeforeEdit = user.currState;
      user.currState = "EDIT:EDIT_DESCRIPTION";
      user.markModified("inProgressData");
      await user.save();

      // Pause Gemini temporarily
      // await user.save();
      console.log(user, "testing user");

      return this.handler.sendMessage(user.chatId, "✏️ Enter new description:");
    } else if (state === "EDIT_DESCRIPTION") {
        console.log(user, "edit desciption");
        user.inProgressData.tempDescription = text;
        user.currState = "EDIT:EDIT_TYPE";
        user.markModified("inProgressData");
        await user.save();
        return this.handler.sendMessage(user.chatId, "💰 Enter type 'income' or 'expense'.");
    }
    else if (state === "EDIT_TYPE") {
      const type = text.toLowerCase();
      if (!["income", "expense"].includes(type)) {
        return this.handler.sendMessage(user.chatId, "⚠️ Type must be 'income' or 'expense'.");
      }
      
      user.inProgressData.tempType = type;
      user.currState = "EDIT:EDIT_AMOUNT";
      user.markModified("inProgressData");
      await user.save();
      
      return this.handler.sendMessage(user.chatId, "🗂 Enter amount");
    }
    else if (state === "EDIT_AMOUNT") {
       if (!this.handler.validateAmount(text)) {
        return this.handler.sendMessage(
          user.chatId,
          "⚠️ Invalid amount",
          this.handler.getMainKeyboard()
        );
      }

      if (user.inProgressData.tempType === "expense") {
        if (!user.totalBudget || user.totalBudget <= 0) {
          return this.handler.sendMessage(
            user.chatId,
            "⚠️ You haven’t set a monthly budget yet. Use /set_budget to define one before adding expenses.",
            this.handler.getMainKeyboard()
          );
        }

        if (parseFloat(text) > user.totalBudget) {
        await this.handler.sendMessage(
          user.chatId,
          "⚠️ This expense exceeds your total budget. Are you sure?",
          this.handler.getMainKeyboard()
        );
        // You could pause here or still allow them to proceed.
      }
    }

      user.inProgressData = { ...user.inProgressData, amount: parseFloat(text) };
      user.markModified("inProgressData");
      user.currState = "TRANSACTION:EDIT_CATEGORY";
      await user.save();
      return this.handler.sendMessage(
        user.chatId,
        "📝Enter category (e.g., food, rent, etc.):",
        this.handler.getCancelKeyboard()
      );


     
    }
    else if (state === "EDIT_CATEGORY") {
      user.inProgressData.tempCategory = text;
      const txn = await Transaction.findById(user.inProgressData.selectedTxnId);
      if (!txn) {
        return this.handler.sendMessage(user.chatId, "❌ Transaction not found.");
      }

      txn.description = user.inProgressData.tempDescription;
      txn.amount = user.inProgressData.tempAmount;
      txn.type = user.inProgressData.tempType;
      txn.category = user.inProgressData.tempCategory;
      await txn.save();

      await this.handler.sendMessage(user.chatId, "✅ Transaction updated successfully!");
      return this.handler.resetUserState(user);
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
    if (user.currState.startsWith("EDIT:EDIT")) {
      return this.startEditExpense(user);
    }
    await this.handler.resetUserState(user);
    return this.handler.showMainMenu(user.chatId);
  }

}

module.exports = EditTransactionController ;
  