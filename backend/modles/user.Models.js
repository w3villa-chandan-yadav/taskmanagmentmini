const { sequelize } = require("../config/db.config");
const { DataTypes } = require("sequelize")

const userModel = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tier: {
    type: DataTypes.ENUM("normal", "silver", "gold"),
    allowNull: false,
    defaultValue: "normal"
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  isDeleted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
    isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  timestamps: true
});

// userModel.sync().then(()=>{
//     console.log("userModel got synced")
// }).catch((error)=>{
//     console.log("there is error in syncing userModle")
// })

module.exports = { userModel }