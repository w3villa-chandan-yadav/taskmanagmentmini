const { ApiError } = require("../middleware/error.Middleware")
const { groupModel } = require("../modles/group.Model");
const { participantModel } = require("../modles/participants.Model");
const { taskModle } = require("../modles/task.Models");
const { Op } = require("sequelize");
const { rawSqlExecquation } = require("../sequle/rawSql");
const { NATIVEQUERIES } = require("../sequle/nativeQueries");



const dashboard = async (req, res, next) =>{
    try {
         const userId = req.user.id;

        //  const NumberOfGroup = await groupModel.findAll({
        //     where:{
        //         userId: userId
        //     }
        //  })

          const tasks = await taskModle.findAll({
            where:{
                userId: userId, 
                groupId: {
                    [Op.not]: null
                  },
            },
            order: [['createdAt', 'DESC']]
        })

         const userAllTasks = await rawSqlExecquation(NATIVEQUERIES.TOATALPARTICIPANTS, [userId, userId])

          const  userAllTaskss = await taskModle.findAll({
                where:{
                    userId: userId,
                    groupId: null
                },
                order: [['createdAt', 'DESC']]
            })


          const GroupNUmber = await participantModel.findAll({
           where:{
            userId,
            userType:"Owner"
           }
        })



           res.status(200).json({
            success: true,
            message: "Task creatd successfully",
            Groups: GroupNUmber.length,
            GroupTask: tasks.length,
            totalTask: userAllTaskss.length ,
            AllUser: userAllTasks
        })
         
    } catch (error) {
        console.log("there is an error in dashboard route");
        next(new ApiError(500,"some thing went wrong"))
    }
}




module.exports = { dashboard }