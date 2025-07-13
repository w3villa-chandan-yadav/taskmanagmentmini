const Joi = require("joi");


const groupCreationSchema = Joi.object({
    groupName: Joi.string().required(), 
})

module.exports = { groupCreationSchema }