const { discountModel } = require("../modles/discount.Model");

const ensureDiscountRowExists = async () => {
  const count = await discountModel.count();
  console.log("this is console log for discount fiedl", count)
  if (count === 0) {
    await discountModel.create({ isDiscountLive: false, endTime: null });
    console.log("✅ Discount row seeded");
  }
};

module.exports = { ensureDiscountRowExists };