const cron = require('node-cron');
const User = require('../models/user.model'); // Adjust path if needed

// 🗓️ Run at 00:00 on the 1st day of every month
cron.schedule('0 0 1 * *', async () => {
  console.log('🔁 Running monthly budget reset...');

  try {
    // Reset the usage tracking field, e.g. spentThisMonth
    await User.updateMany({}, { $set: { totalBudget: 0 } });

    console.log('✅ Monthly budget usage reset complete.');
  } catch (err) {
    console.error('❌ Error in budget reset:', err.message);
  }
});
