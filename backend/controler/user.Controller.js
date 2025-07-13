const  axios = require("axios")
const { sendMail } = require("../config/mail.config")
const { USERERRORS, SERVER } = require("../constant/error.constant")
const { PATHS } = require("../constant/path.constant")
const { userRegistrationSchema, userVerificationSchema, userLoginSchema } = require("../dto/user.dto")
const { oauth2client } = require("../helpers/googleConfig")
const { ApiError } = require("../middleware/error.Middleware")
const { commentModels } = require("../modles/comment.Models")
const { emailModel } = require("../modles/emailVerification.Model")
const { userModel } = require("../modles/user.Models")
const { NATIVEQUERIES } = require("../sequle/nativeQueries")
const { rawSqlExecquation } = require("../sequle/rawSql")
const { generateJwtToken } = require("../utils/generateJwt")
const { generateToken } = require("../utils/generateToken")
const { getPasswordHash, checkPassword } = require("../utils/hashPassword")
const { Op } = require("sequelize");




// const result = await rawSqlExecquation(NATIVEQUERIES.FETCHALLUSER)
// await sendMail("chandankumaryadav544@gmail.com", "subject ", "chadnan" ,"http://localhost:4000") 




// -------------------------------user register-------------------------------//
exports.register = async ( req , res , next )=>{
    try {
        console.log(req.originalUrl)
        const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        
        const { error } = userRegistrationSchema.validate(req.body);    
        if(error){
            console.log(error)
            return next(new ApiError(401,USERERRORS.LOGINERROR.INSUFFICIENT))
        }

        const { name, email, password } = req.body ;
     

        const existingUser = await userModel.findOne({
            where:{
                email: email
            }
        })

       if(existingUser){
          return  next(new ApiError(400, USERERRORS.LOGINERROR.ALREADYUSER))
       }

       const newPassword = await getPasswordHash(password);
       
       console.log(newPassword,"................................>>>...........")

       const verificationToken = await generateToken()

       const newUser = await userModel.create({name , email , password: newPassword })

       console.log(newUser)

       await emailModel.create({ userId: newUser.dataValues.id , token: verificationToken})

      let link = ""

      if(`${req.protocol}://${req.get('host')}` === PATHS.CHECKER.LOCALSERVER ){
        link = `${PATHS.SENDER.LOCALSERVER}${verificationToken}`
      }else{
        link = `${PATHS.SENDER.SERVER}${verificationToken}`
      }
       
       const mailResult = await sendMail(email, "Activation link", name, link);

        res.status(200).json({
            success: true,
            message: 'Please check email and verify the link',
            data: []
        })

    } catch (error) {
        console.log("error in registering", error)
        next(new ApiError(500,SERVER.INTERNALERROR))
    }
}


//----------------userVerification Email -----------------------------//

exports.userVerification = async (req , res, next )=>{
    try {
        
        const { error } = userVerificationSchema.validate(req.body);

        if(error){
              return next( new ApiError(400, USERERRORS.LOGINERROR.INSUFFICIENT));
        }

        const {token } = req.body; 

        const result = await rawSqlExecquation(NATIVEQUERIES.FETCHISVALIDATED, [ token ]);

        console.log(result)

        if(result.length < 1){
            return next(new ApiError(401, USERERRORS.VERIFICATION.INVALIDTOKEN))
        }

        console.log(result[0].id)

       const expireAt = result[0].expiresAt ;
       
       if(new Date() > expireAt ){
        return next(new ApiError(200, USERERRORS.VERIFICATION.INVALIDTOKEN))
       }

       console.log(result)

       const id = result[0].userId

    //    const updateuser = await userModel.update({isVerified: true},{where:{id: id }})

    const updateuser = await userModel.update(
        { isVerified: true }, 
        { where: { id: id }, }
      );

     

       console.log(updateuser)

       res.status(200).json({
        success: true,
        message: "user Validated",
        data: []
       })

    } catch (error) {
        console.log("erro in varification ", error);
        next(new ApiError(500,SERVER.INTERNALERROR))
    }
}



//---------------------login user ---------------------------------------//

exports.login = async (req, res, next) => {
  try {
    const { error } = userLoginSchema.validate(req.body);
    if (error) {
      return next(new ApiError(400, USERERRORS.LOGINERROR.INSUFFICIENT));
    }

    const { email, password } = req.body;

    const isUser = await userModel.findOne({
      where: { email },
    });

    if (!isUser) {
      return next(new ApiError(401, USERERRORS.LOGINERROR.INVALIDCREADIENTIAL));
    }

    // ✅ New Check: Is Account Deleted?
    if (isUser.isDeleted) {
      return next(new ApiError(403, "Your account has been deleted. Please contact support."));
    }

    // ✅ New Check: Is Account Blocked?
    if (isUser.isBlocked) {
      return next(new ApiError(403, "Your account has been blocked. Please contact support."));
    }

    if (!isUser.dataValues.isVerified) {
      const verificationToken = await generateToken();

      await emailModel.create({
        userId: isUser.dataValues.id,
        token: verificationToken,
      });

      const link =
        `${req.protocol}://${req.get("host")}` === PATHS.CHECKER.LOCALSERVER
          ? `${PATHS.SENDER.LOCALSERVER}${verificationToken}`
          : `${PATHS.SENDER.SERVER}${verificationToken}`;

      await sendMail(email, "Activation link", isUser.dataValues.name, link);

      return res.status(201).json({
        success: false,
        message: "Verification link sent to your email",
        data: [],
      });
    }

    const isPasswordCorrect = await checkPassword(password, isUser.dataValues.password);

    if (!isPasswordCorrect) {
      return next(new ApiError(402, USERERRORS.LOGINERROR.INVALIDCREADIENTIAL));
    }

    const token = await generateJwtToken({ ...isUser.dataValues, password: null });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        // sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        success: true,
        message: "User login successful",
        data: [{ ...isUser.dataValues, password: null, token }],
      });
  } catch (error) {
    console.log("error in login ", error);
    next(new ApiError(500, SERVER.INTERNALERROR));
  }
};


exports.GoogleLogin = async(req,res)=>{

    try {
        const {code} = req.query ;
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`)
  
        console.log(userRes.data)
        
        const {email ,name ,picture } = userRes.data ;

        console.log(email,name,picture)

      if(!email || !name || !picture){
        return res.status(400).json({
          success:false,
          message:"bad request"

        })
      }

      let isUser = await userModel.findOne({
        where:{
          email: email
        }
      })

      


      console.log(" is user  -- - -- - - ", isUser)

      let message = " user Login SuccessFully"

      if(!isUser){
        const string = "erthkh765erdcvb0-9dfxb987645dcvx98oy4exrc8"
        const length = Math.floor(Math.random() * 3) + 6; // Random length between 6 and 8
          let newPassword = '';
          for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * string.length);
            newPassword += string[randomIndex];
          }

          console.log("rando paddword", newPassword)
        const newPasswordd = await getPasswordHash(password);


       isUser =  await userModel.create({name , email , password: newPasswordd,isVerified: true })
       message = " User created Successfuly"
      }


      console.log("this is the user created ,,,", isUser)


    const token = await generateJwtToken({ ...isUser.dataValues, password: null });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        // sameSite: 'none',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }).status(200).json({
        success: true,
          message,
          data: [{ ...isUser.dataValues, password: null, token , picture}],
        })
                
    } catch (error) {
        res.json({
              error,
            message:"error in server",
            success: false

        })
        
    }


}
// /google




exports.searchUser = async (req, res, next) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required.",
      });
    }

    const users = await userModel.findAll({
      where: {
        [Op.or]: [
        //   { name: { [Op.like]: `%${query}%` } },
          { email: { [Op.like]: `%${query}%` } },
        ],
      },
      attributes: ["id", "name", "email"], // omit password
      limit: 10,
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error in searchUser controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'tier', 'isVerified', 'createdAt'],
    });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    next(error);
  }
};

// Update current user's profile
exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, tier } = req.body;

    const user = await userModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Only update provided fields
    if (name) user.name = name;
    if (tier && ["normal", "silver", "gold"].includes(tier)) user.tier = tier;

    await user.save();

    res.status(200).json({ success: true, message: "Profile updated", user });
  } catch (error) {
    console.error("Error updating profile:", error);
    next(error);
  }
};