// models/discount.Model.js
const { sequelize } = require("../config/db.config");
const { DataTypes } = require("sequelize");

const discountModel = sequelize.define("discount", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  isDiscountLive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = { discountModel };
