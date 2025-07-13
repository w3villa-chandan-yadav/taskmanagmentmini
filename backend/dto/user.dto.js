const joi = require("joi");


const userRegistrationSchema = joi.object({
    name: joi.string().min(3).max(40).required(),
    email: joi.string().email().required(),
    password: joi.string().min(8).max(20).required(),
}).required();


const userVerificationSchema = joi.object({
    token: joi.string().required()
})

const userLoginSchema = joi.object({
    email: joi.string().required(),
    password: joi.string().min(6).required()
})


module.exports = { userRegistrationSchema, userVerificationSchema , userLoginSchema }

