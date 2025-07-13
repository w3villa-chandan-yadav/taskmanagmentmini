const { sequelize } = require("../config/db.config");
const { DataTypes } = require("sequelize");
const { userModel } = require("./user.Models");
const { groupModel } = require("./group.Model");


const participantModel = sequelize.define("participan",{
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
    userType: {
        type: DataTypes.ENUM("Member","Owner"),
        allowNull:false,
        defaultValue: "Owner"
      },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: groupModel,
            key: "id"
        },
        onDelete: "CASCADE"
    }
})

module.exports = { participantModel }