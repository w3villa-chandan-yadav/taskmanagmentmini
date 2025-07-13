const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const { userModel } = require("./user.Models");
const { groupModel } = require("./group.Model");


const taskModle = sequelize.define("tasks",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    task: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    groupId: {
       type: DataTypes.INTEGER,
       allowNull: true,
       references: {
        model: groupModel,
        key: "id"
       },
       onDelete: "CASCADE"
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references:{
            model: userModel,
            key: "id"
        },
        onDelete: "SET NULL"
    },
    importance: {
        type : DataTypes.ENUM("LOW","MEDIUM","HIGH"),
        allowNull: false,
        defaultValue: "LOW"
    },
    status: {
        type: DataTypes.ENUM("start","ongoing","completed"),
        allowNull: false,
        defaultValue: "start"
    }
},{
    timestamps: true
})


module.exports = { taskModle }