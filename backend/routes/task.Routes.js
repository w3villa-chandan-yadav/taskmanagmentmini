const express = require("express");
const { isAuthenticate } = require("../middleware/auth.Middleware");
const { createTask, getAllTask, updateTaskStatus, deleteTask, createGroup, groupTasks, getSingleGroupTask } = require("../controler/task.controller");
const { dashboard } = require("../controler/dashboard.Controller");
const { searchUser } = require("../controler/user.Controller");
const taskRoute = express.Router();

taskRoute.post("/create", isAuthenticate, createTask)
taskRoute.get("/getAllTask", isAuthenticate, getAllTask)
taskRoute.put("/taskUpdateStatus", isAuthenticate, updateTaskStatus)
taskRoute.delete("/deleteTask", isAuthenticate, deleteTask)
taskRoute.post("/createGroup", isAuthenticate, createGroup)
taskRoute.get("/getGroupTask", isAuthenticate, groupTasks)
taskRoute.get("/getSingleGroupTask/:groupId", isAuthenticate ,getSingleGroupTask)
taskRoute.get("/dashboard", isAuthenticate, dashboard)
taskRoute.get("/searchUser", isAuthenticate,searchUser)



module.exports = { taskRoute }