const Transaction = require("../models/transaction.model");

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
    user.inProgressData = { type: "expense" }; 
    await user.save();
    this.handler.sendMessage(
      user.chatId,
      "💰 Select currency:",
      this.handler.createKeyboard([...this.CURRENCIES, "/main"])
    );
  }

  async startAddIncome(user) {
    user.currState = "TRANSACTION:ADD_CURRENCY";
    user.inProgressData = { type: "income" }; // 👈 distinguish from expense
    await user.save();
    
    this.handler.sendMessage(
      user.chatId,
      "💰 Select income currency:",
      this.handler.createKeyboard([...this.CURRENCIES, "/main"])
    );
  }
  
  
  async handleInput(user, text) {
    console.log("ra ram ")
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
        this.handler.getMainKeyboard()
      );
    }

    if (user.inProgressData.type === "expense") {
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
    user.currState = "TRANSACTION:ADD_DESCRIPTION";
    await user.save();
    this.handler.sendMessage(
      user.chatId,
      "📝 Enter description:",
      this.handler.getCancelKeyboard()
    );
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
        splitType: "personal",
      });
      await transaction.save();
      user.transactions.push(transaction._id);

      if (transaction.type === "expense") {
        user.totalBudget -= transaction.amount;
      }

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

  getCancelKeyboard() {
  return {
    keyboard: [[ "/main"]],
    resize_keyboard: true,
    one_time_keyboard: true,
  };
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
