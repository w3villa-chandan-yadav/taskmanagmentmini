const { sequelize } = require("../config/db.config");
const { DataTypes } = require("sequelize");
const { userModel } = require("./user.Models");


const groupModel = sequelize.define("group",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
       type: DataTypes.INTEGER,
       allowNull: false,
       references: {
        model: userModel,
        key: "id"
       },
       onDelete: "CASCADE"
    },
    groupName: {
        type: DataTypes.STRING,
        allowNull: false
    },
})


module.exports = { groupModel }