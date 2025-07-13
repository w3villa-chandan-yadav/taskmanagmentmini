const { sequelize }  = require("../config/db.config")



const rawSqlExecquation = async ( query , options , transactions )=>{
  
    try {
        const [result] = await sequelize.query(query ,{ replacements : options , ...(transactions && { transaction : transactions})})
         
        return result ;
    } catch (error) {
        console.log( "error in sql queries", error)
        throw new Error("error in sql queries executions");
    }
}

module.exports = { rawSqlExecquation }