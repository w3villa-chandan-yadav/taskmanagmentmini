const express = require("express");
const { paymentCachup, verifyingPayment, ongongDiscount } = require("../controler/paymnet.Controller");
const { isAuthenticate } = require("../middleware/auth.Middleware");
const paymentRoute = express.Router();


paymentRoute.post("/createPayment",isAuthenticate, paymentCachup)
paymentRoute.post("/verify", isAuthenticate,verifyingPayment)
paymentRoute.get("/discountCount", ongongDiscount)




module.exports = { paymentRoute }