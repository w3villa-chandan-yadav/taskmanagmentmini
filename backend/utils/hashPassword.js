const bcrypt = require("bcryptjs");


const getPasswordHash = async (password)=>{
 
    return await bcrypt.hash(password, 10);

}


const checkPassword = async (password, hashPassword)=>{
    return await bcrypt.compare(password, hashPassword)
}



module.exports = { getPasswordHash, checkPassword }