class BudgetController {
  constructor(handler) {
    this.handler = handler;
  }


    async startSetBudget(user) {
    // Your logic for editing expense
    this.bot.sendMessage(user.chatId, "Please testing.");
    }

}



module.exports = BudgetController;