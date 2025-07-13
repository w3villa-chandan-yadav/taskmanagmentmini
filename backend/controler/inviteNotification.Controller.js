const { groupModel } = require("../modles/group.Model");
const { sendNotification } = require("./notification.Controller");

const sendInviteNotification = async (req, res, next) => {
  try {
    const senderId = req.user.id;
    const { receiverId, groupId } = req.body;

    console.log(req.body, "this is oodbf")

    if (!receiverId || !groupId || !senderId) {
      return res.status(400).json({ success: false, message: "Missing data" });
    }

    console.log(groupId)

    const groupNames = await groupModel.findOne({
        where:{
            id: groupId
        }
    }) 

    console.log(groupNames.dataValues, "htisih")

    if(groupNames.dataValues.userId !== senderId){
        return     res.status(400).json({ success: false, message: "You are not owner of the group" });

    }

    const message = `You have been invited to join the group "${groupNames.dataValues.groupName}"`;

    await sendNotification({
      userId: receiverId,
      type: "group_invite",
      message,
      groupId,
      type: "invite"
    });


    // Optionally emit socket event if receiver is online
    const io = req.app.get("io"); // You must store io in app.js: `app.set("io", io);`
    io?.to(receiverId).emit("new_invite", { message });

    res.status(200).json({ success: true, message: "Notification sent" });
  } catch (err) {
    console.error("Error sending invite:", err);
    next(err);
  }
};

module.exports = { sendInviteNotification };
