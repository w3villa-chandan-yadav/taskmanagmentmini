const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/db.config");
const { userModel } = require("./user.Models");
const { taskModle } = require("./task.Models");
const { emailModel } = require("./emailVerification.Model");
const { groupModel } = require("./group.Model");
const { participantModel } = require("./participants.Model");
const { notificationModel } = require("./notification.Model");

const commentModels = sequelize.define("comments",{
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    comment: {
       type: DataTypes.STRING,
       allowNull: false,
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
    taskId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: taskModle,
            key: "id"
        },
        onDelete: "CASCADE"
    }
},{
    timestamps: true
})

// { alter: true }
userModel.sync({ alter: true }).then(()=>{
    console.log("userModel got synced")

    return groupModel.sync()
}).then(()=>{
   console.log("group model synced successfuly")

   return participantModel.sync()
}).then(()=>{

    return taskModle.sync({alter: true});
}).then(()=>{
    console.log("taskModel got synced")

    return commentModels.sync()
}).then(()=>{
    console.log("commentModel got synced")

    return emailModel.sync()
}).then(()=>{
    console.log("email sync successfully")

    return notificationModel.sync()
}).then(()=>{
    console.log("Notification sync successfully")
}
).catch((error)=>{
    console.log("there is error in syncing userModle")
})


module.exports = { commentModels }
