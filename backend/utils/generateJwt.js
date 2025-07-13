require("dotenv").config({
     path : `./utils/.${process.env.NODE_ENV || "development"}.env`
})
const jwt = require("jsonwebtoken");

console.log("in jwtjson", process.env.JWT_SECRET)


const generateJwtToken = async ( options , expireIn = "5d" )=>{
    return await jwt.sign(options,process.env.JWT_SECRET,{expiresIn : expireIn})
}


module.exports =  { generateJwtToken }