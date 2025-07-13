require("dotenv").config({
    path : `./utils/.${process.env.NODE_ENV || "development"}.env`
})
const nodemailer = require("nodemailer");
const { verifyEmailTamplet } = require("../utils/mail.Tamplets");

console.log("here",process.env.PORT)


const transpoter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})


const sendMail = async ( reciverMailAddresh, subject , userName ,link )=>{

    const options ={
        form: process.env.EMAIL,
        to: reciverMailAddresh,
        subject: subject,
        html: verifyEmailTamplet( userName , link )
    }

    transpoter.sendMail(options, ( error , info )=>{
        if(error){
             console.log("Error in sending Mail ", error);
             return false
        }
         console.log("mail send successfully")
        return info ;
    }) 

}


module.exports = { sendMail }

