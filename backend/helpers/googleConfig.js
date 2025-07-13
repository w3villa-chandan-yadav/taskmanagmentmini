const  {google} = require("googleapis") ;
const {config} = require("dotenv")

config() ;
// console.log("in google")

const GOOGLE_CLIENT_ID =process.env.GOOGLE_CLIENT_ID ;

const GOOGLE_CLIENT_SECRET =process.env.GOOGLE_CLIENT_SECRET ;


console.log(GOOGLE_CLIENT_ID ,GOOGLE_CLIENT_SECRET)


exports.oauth2client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    "postmessage" 
)