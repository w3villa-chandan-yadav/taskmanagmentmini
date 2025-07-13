const jwt = require("jsonwebtoken");
const { ApiError } = require("./error.Middleware");
const { USERERRORS, SERVER } = require("../constant/error.constant");

const isAuthenticate = async (req, res, next)=>{
    try {

        const token = req.cookies.token || req.body?.token || req.header("Authorization");

        if(!token){
            return next(new ApiError(401, USERERRORS.VERIFICATION.INVALIDTOKEN))
        };

        let decode ;

        try {
             decode = await jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            throw new Error("Token is in wrong formate")
        }

        req.user = decode ;

        next()
    } catch (error) {
        console.log("error in the middleware isAuthenticated",error);
        return next(new ApiError(500, SERVER.INTERNALERROR))
    }
}

module.exports = { isAuthenticate }