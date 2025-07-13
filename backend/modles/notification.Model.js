// models/notification.Model.js
const { sequelize } = require("../config/db.config");
const { DataTypes } = require("sequelize");
const { userModel } = require("./user.Models");

const notificationModel = sequelize.define("notifications", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: userModel,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  type: {
    type: DataTypes.STRING, // e.g. "invite", "task", etc.
    allowNull: false,
  },
  message: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  groupId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  seen: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
    status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
    defaultValue: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = { notificationModel };
