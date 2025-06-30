class BudgetController {
  constructor(handler) {
    this.handler = handler; 
  }


  async startSetBudget(user) {
    user.currState = "BUDGET:BUDGET_SET";
    
    await user.save();

    this.handler.sendMessage(
      user.chatId,
      "💰 Please enter your new monthly budget amount:"
    );
  }


  async handleInput(user, text) {
    console.log(user.currState, "dnfjs ");
    const [_, state] = user.currState.split(":");

    if (state === "BUDGET_SET") {

      const amount = parseFloat(text);

      if (isNaN(amount) || amount < 0) {
        return this.handler.sendMessage(
          user.chatId,
          "⚠️ Invalid amount. Please enter a valid number."
        );
      }

      user.totalBudget = amount;
      user.currState = ""; 
      await user.save();

      return this.handler.sendMessage(
        user.chatId,
        `✅ Your monthly budget has been set to ₹${amount}.`
      );
    }

  }
}

module.exports = BudgetController;
