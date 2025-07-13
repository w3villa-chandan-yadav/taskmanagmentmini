//  --------------------ApiError constructor --------------------------------------//  
   class ApiError extends Error{
        constructor( statusCodes, message, data = [] ){
            super(message)
            this.success= false ;
            this.statusCode= statusCodes || 500;
            this.data= data;
        }
    }

// --------------  Error middleware --------------------------------//
    const errorHandler = ( err, req, res ,next)=>{
        try {
            const { message, statusCode, success, data } = err ;
            console.log(statusCode, message, data , success ,)
           res.status(statusCode || 500).json({
            message: message,
            success: success,
            data: data
           })
        } catch (error) {
        console.log("error middleware is not working , the error  is ---> ",error) 
        }
    }


 module.exports = { ApiError, errorHandler  }