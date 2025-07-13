const express = require("express");
const { register, userVerification, login, getProfile, updateProfile, GoogleLogin } = require("../controler/user.Controller");
const { isAuthenticate } = require("../middleware/auth.Middleware");
const route = express.Router();

route.post("/user/register",register)
route.post("/user/verification",userVerification);
route.post("/user/login", login)
route.get("/profile",isAuthenticate,getProfile)
route.put("/profile",isAuthenticate,updateProfile)
route.get("/googleLogin",GoogleLogin)



// google







module.exports = route ;