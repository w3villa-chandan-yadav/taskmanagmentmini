const Joi = require("joi");

const taskSchema = Joi.object({
    task: Joi.string().min(5).required(),
    groupId: Joi.number().optional()
}).required()

const updateSchema = Joi.object({
    taskId: Joi.string().required(),
    task: Joi.string().required(),
    groupId: Joi.number().optional()
}).required()

module.exports = { taskSchema, updateSchema }