const crypto = require("crypto")

const generateToken = async ()=>{
    return  crypto.randomBytes(34).toString("hex")
}


module.exports = { generateToken }