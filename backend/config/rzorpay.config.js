const Razorpay  = require("razorpay");
require("dotenv").config({
    path: `../utils/.${process.env.NODE_ENV || "development"}.env`
})
// const { generateToken } = require("../utils/generateToken");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
})

module.exports =  { razorpay }

