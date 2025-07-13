const express = require("express");
const { paymentCachup, verifyingPayment } = require("../controler/paymnet.Controller");
const { isAuthenticate } = require("../middleware/auth.Middleware");
const paymentRoute = express.Router();


paymentRoute.post("/createPayment",isAuthenticate, paymentCachup)
paymentRoute.post("/verify", isAuthenticate,verifyingPayment)



module.exports = { paymentRoute }