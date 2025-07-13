const { Sequelize } = require("sequelize");
const fs = require("fs")
const dotenv = require("dotenv")


dotenv.config()

const sequelize = new Sequelize(process.env.DATABASENAME,process.env.DATABASEUSERNAME,process.env.DB_PASSWORD,{
    host: process.env.DATABASEHOST,
    dialect: "mysql",
    port: 17412,
    ssl: {
        require: true,
        ca: fs.readFileSync('./ca.pem').toString()
    }
})


sequelize.authenticate().then(()=>{
    console.log("dataBase connected successfully")
}).catch((err)=>{
    console.log("error in dataBase connection",err)
})

module.exports = { sequelize }