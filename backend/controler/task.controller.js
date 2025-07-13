const { Op } = require("sequelize");
const { SERVER, USERERRORS } = require("../constant/error.constant");
const { taskSchema, updateSchema } = require("../dto/task.dto");
const { ApiError } = require("../middleware/error.Middleware");
const { groupModel } = require("../modles/group.Model");
const { participantModel } = require("../modles/participants.Model");
const { taskModle } = require("../modles/task.Models");
const { userModel } = require("../modles/user.Models");
const { NATIVEQUERIES } = require("../sequle/nativeQueries");
const { rawSqlExecquation } = require("../sequle/rawSql");
const { number } = require("joi");



const createTask = async (req, res, next)=>{
    try {
        
        const { error } = taskSchema.validate(req.body);

        if(error){
            console.log(error.details[0].message)
            return next(new ApiError(401, error.details[0].message))
        }

        const { task, groupId } = req.body;
        const userID = req.user.id ;

        // console.log(task, groupId ,"-------------------------------------------------")

        const data = groupId ? {
                task: task,
                groupId: groupId,
                userId: userID
        } : {
            task: task,
            userId: userID
        }

        const newTask = await taskModle.create(data)

        res.status(200).json({
            success: true,
            message: "Task creatd successfully",
            data: [newTask]
        })

    } catch (error) {
        console.log("error in creating task",error);
        return next( new ApiError(500, SERVER.INTERNALERROR))
    }
}

const getAllTask = async (req, res, next)=>{
    try {
        const userId = req.user.id ;
        const groupId = req.query.groupId;

        console.log(groupId)

      let userAllTasks ;

      if(groupId === "true"){
        userAllTasks = await rawSqlExecquation(NATIVEQUERIES.FINDGROUPOFUSER, [userId])
        // console.log(userAllTasks)

      }else{
        userAllTasks = await taskModle.findAll({
            where:{
                userId: userId,
                groupId: null
            },
            order: [['createdAt', 'DESC']]
        })

      }

        
    //   console.log(userAllTasks)

        res.status(200).json({
            success: true,
            message: "All task fetch successfully",
            data: userAllTasks
        })
        
    } catch (error) {
        console.log("error in the getAll task ", error);
        return next(new ApiError(500, SERVER.INTERNALERROR))
    }
}

const getsingleTask = async (req, res, next)=>{
    try {
        const { id } = req.query ;

        if( !id ){
            return next(new ApiError(401, USERERRORS.TASKS.NOTFOUND))
        }

        const getTask = await taskModle.findByPk(id);

        if(!getTask){
            return next( new ApiError(401, USERERRORS.TASKS.NOTFOUND))
        };

        res.status(200).json({
            success: true,
            message: "Specific task fetched successfully",
            data: [getTask]
        })
        
    } catch (error) {
        console.log("error in the getsingle task controller", error);
        return next(new ApiError(500, SERVER.INTERNALERROR))
    }
}

const deleteTask = async (req, res, next)=>{
    try {
        const { taskId, isGroup } = req.body ;

        if(!taskId){
            return next(new ApiError(401, USERERRORS.LOGINERROR.INSUFFICIENT))
        }

        const userId = req.user.id ;

        const taskTodeleted = await taskModle.findByPk(taskId);

        if(!taskTodeleted){
            return next(new ApiError(401, USERERRORS.TASKS.NOTFOUND))
        }

        if(isGroup){

           const  isUser = await rawSqlExecquation(NATIVEQUERIES.ISMEMBEROFGROP,[userId]);

           if(!isUser){
            return next(new ApiError(401, USERERRORS.TASKS.NOTFOUND))
           }


        }else{
        if(userId != taskTodeleted.dataValues.userId){
            return next(new ApiError(401, USERERRORS.TASKS.NOTALLOWEDOTHEROWNER))
        }
    }

    const deletedTask = await taskModle.destroy({
        where:{
            id: taskId
        }
    })

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
            data: []
        })
        
    } catch (error) {
        console.log("error in the deleting task",error);
        return next(new ApiError(500, SERVER.INTERNALERROR))
    }
}

const updateTask = async (req, res, next)=>{
    try {
        const { error } = updateSchema.validate(req.body);

        if(error){
            return next(new ApiError(401, USERERRORS.TASKS.ALLFIELDSREQUIRE))
        }
        
        const { taskId, task ,groupId} = req.body ;

        const taskToUpdate = await taskModle.findByPk(taskId);

        if(!taskToUpdate){
            return next(new ApiError(401, USERERRORS.TASKS.NOTFOUND))
        }

        const userId = req.user.id ;


        let  updatedTask ;

       if(!groupId){
        if(userId != taskToUpdate.dataValues.id){
            return next(new ApiError(401, USERERRORS.TASKS.NOTALLOWEDOTHEROWNER))
        };

         updatedTask = await taskModle.update({
            task:task
        },{
            where:{
           id: taskId
            }
        })
       }

       const isMemberOfGroup = await rawSqlExecquation( NATIVEQUERIES.ISMEMBEROFGROP ,[userId]) ;

       if(!isMemberOfGroup){
        return next(401, USERERRORS.TASKS.NOTALLOWEDOTHEROWNER)
       }

       updateTask = await taskModle.update({
                            task:task
                        },{
                            where:{
                        id: taskId
                            }
                        })
   

        res.status(200).json({
            success: true,
            message: "taks updated successfully",
            data: [updatedTask]
        })


    } catch (error) {
        console.log("error in the updateTask",error);
        return next(new ApiError(500, SERVER.INTERNALERROR))
    }
}

const updateTaskStatus = async (req, res, next)=>{
    try {
        const  { taskId, status, isGroup } = req.body;

        const userId = req.user.id ;
      
        console.log(taskId, status, userId, isGroup)

        if(!taskId || ! req.user.id){
            return next(new ApiError(401, USERERRORS.TASKS.ALLFIELDSREQUIRE))
        }

        let isUser;

        if(isGroup){

             isUser = await rawSqlExecquation(NATIVEQUERIES.ISMEMBEROFGROP,[userId]);


        }else{
        
           isUser = await taskModle.findOne({
            where:{
                id: taskId,
                userId: userId
            }
          })

        //   console.log(isUser)
       

        }


        if(!isUser){
            return next(new ApiError(401, USERERRORS.TASKS.NOTFOUND))
        }

        // console.log(isUser)


        const updatedTaskStatus = await taskModle.update({status: status},{
            where:{
                id: taskId
            }
        })

        console.log(updatedTaskStatus)



        return res.status(200).json({
            success: true,
            message: "Task updated",
            data: []
        })
   

    } catch (error) {
        console.log("there is an error in updateTask controller ", error);
        next(new ApiError(500, SERVER.INTERNALERROR))
    }
}


const createGroup = async (req, res, next)=>{
    try {
        
        const { groupName } = req.body;

        if(!groupName){
            return next(new ApiError(401, USERERRORS.TASKS.ALLFIELDSREQUIRE))
        }

        const userId = req.user.id;

        const CheckUser = await userModel.findByPk(userId)

        if(CheckUser.dataValues.tier === "normal"){
            return next(new ApiError(401, USERERRORS.VERIFICATION.UPGRADETIER))
        }

        const newGroup = await groupModel.create({
            groupName,
            userId
        })

        const newParticipant = await participantModel.create({
            userId,
            groupId: newGroup.dataValues.id,
        })

        console.log(newParticipant);
        console.log(newGroup);

        if(!newGroup){
            return next(new ApiError(500, SERVER.INTERNALERROR))
        }
        res.status(201).json({
            success: true,
            message: "group created successfully",
            data: [newGroup]
        })
    } catch (error) {
        console.log("error in the create Group route ",error);
        next(new ApiError(500, SERVER.INTERNALERROR))
    }
}



const groupTasks = async (req, res, next)=>{
    try {
        
        const userId = req.user.id ;

        // const tasks = await rawSqlExecquation( , [userId]) ;

        const tasks = await taskModle.findAll({
            where:{
                userId: userId, 
                groupId: {
                    [Op.not]: null
                  },
            },
            order: [['createdAt', 'DESC']]
        })

        console.log(tasks)


        res.status(200).json({
            success: true,
            message: "Task of teams",
            data: tasks
        })

    } catch (error) {
        console.log("error in the groupTask controller ", error);
        next(new ApiError(500, SERVER.INTERNALERROR))
    }
}

const getSingleGroupTask = async (req, res, next)=>{
    try {
        const id = req.params.groupId ;
        const groupId = Number(id)

        console.log(groupId)

        if(!groupId){
            return next(new ApiError(401, USERERRORS.TASKS.ALLFIELDSREQUIRE))
        }

        const userId = req.user.id ;


        const [isUserOfThisGroup] = await rawSqlExecquation(NATIVEQUERIES.ISMEMBEROFGROUPTOFETCH, [userId , groupId ])
        
        // console.log(isUserOfThisGroup)

        if(!isUserOfThisGroup){
            return next(new ApiError(401, USERERRORS.TASKS.NOTFOUND))
        }

        const tasksOfTheSingleGroup = await rawSqlExecquation(NATIVEQUERIES.TASKOFSINGLEGROUP ,[groupId])

       console.log(tasksOfTheSingleGroup)

       

        res.status(200).json({
            success: true,
            message: "Single group data",
            data: tasksOfTheSingleGroup
        })


    } catch (error) {
        console.log("error in the getSingleGroupTask", error);
        next(new ApiError(500, SERVER.INTERNALERROR))
    }
}





module.exports = { createTask, deleteTask, updateTask, getAllTask, getsingleTask, updateTaskStatus, deleteTask, createGroup, groupTasks, getSingleGroupTask }