const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const { userModel } = require("./user.Models");


const emailModel = sequelize.define("emailVerificatoin",{
    id: {
     type: DataTypes.INTEGER,
     autoIncrement: true,
     primaryKey: true
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: userModel,
            key: "id"
        },
        onDelete: "CASCADE"
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: ()=>{
            const currentTime = new Date();
            currentTime.setMinutes(currentTime.getMinutes()+5);
            return currentTime
        }
    }
},{
    timestamps: false
})


module.exports = { emailModel }