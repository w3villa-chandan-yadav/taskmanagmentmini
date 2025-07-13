const { SERVER, USERERRORS } = require("../constant/error.constant");
const { groupCreationSchema } = require("../dto/group.dto");
const { ApiError } = require("../middleware/error.Middleware");
const { groupModel } = require("../modles/group.Model");


const createGroup = async (req, res, next)=>{
    try {
        const { error } = groupCreationSchema.validate(req.body);

        if(error){
            return next(new ApiError(401, USERERRORS.TASKS.ALLFIELDSREQUIRE))
        }

        const  { groupName } = req.body;

        const userId =req.user.id;

        const newGroup = await groupModel.create({
            userId: userId,
            groupName: groupName
        });

        res.status(201).json({
            success: true,
            message: "New room created successfully",
            data: [newGroup]
        })

    } catch (error) {
        console.log("error in the creating grop controller",error);
        return next(new ApiError(500, SERVER.INTERNALERROR))
    }
}



