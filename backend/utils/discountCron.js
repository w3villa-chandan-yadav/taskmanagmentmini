// jobs/discountCron.js
const cron = require('node-cron');
const { discountModel } = require('../modles/discount.Model');

const toggleDiscount = async () => {
  const discount = await discountModel.findOne();

//   console.log("-0-0-0-0-0-0", discount)

  const isCurrentlyLive = discount.isDiscountLive;

  if (isCurrentlyLive) {
    // Turn off
    await discount.update({ isDiscountLive: false, endTime: null });
    console.log("🔕 Discount turned OFF");
  } else {
    // Turn on for next 10 minutes
    const endTime = new Date(Date.now() + 6 * 60 * 1000);
    await discount.update({ isDiscountLive: true, endTime });
    console.log("🎉 Discount turned ON");
  }
};

// Schedule job to run every 10 minutes
const startDiscountCron = () => {
  cron.schedule('*/6 * * * *', () => {
    toggleDiscount();
  });
  console.log("🕒 Discount cron started: toggles every 10 minutes");
};

module.exports = { startDiscountCron };
