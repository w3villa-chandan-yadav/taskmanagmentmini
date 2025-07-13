const { notificationModel } = require("../modles/notification.Model");
const { Op } = require("sequelize");
const { participantModel } = require("../modles/participants.Model");
const { ApiError } = require("../middleware/error.Middleware");

// Send Notification (with optional groupId)
const sendNotification = async ({ userId, type, message, groupId = null }) => {
  // If it's an invite, ensure user isn't already in the group
  if (type === 'invite' && groupId) {
    const isAlreadyParticipant = await participantModel.findOne({
      where: {
        userId,
        groupId,
      },
    });

    if (isAlreadyParticipant) {
      // Optional: silently return null, or throw error
      console.log("User is already part of the group. No invite sent.");
      throw new ApiError(400, "User is already invited")
    }

    // Also check if a previous invite exists (optional, prevents spamming)
    const existingInvite = await notificationModel.findOne({
      where: {
        userId,
        groupId,
        type: 'invite',
        seen: false, // optionally only check for unread
      },
    });

    if (existingInvite) {
      console.log("Invite already sent to user and still pending.");
      return null;
    }
  }

  // Create the notification
  return await notificationModel.create({
    userId,
    type,
    message,
    groupId,
  });
};


// 🔹 Get All Notifications for a User
const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const notifications = await notificationModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({ success: true, notifications });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    next(err);
  }
};

// 🔹 Mark a Single Notification as Read
const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await notificationModel.update(
      { seen: true },
      {
        where: {
          id: notificationId,
          userId,
        },
      }
    );

    if (result[0] === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification marked as read" });
  } catch (err) {
    console.error("Error marking notification as read:", err);
    next(err);
  }
};

// 🔹 Mark All as Read
const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    await notificationModel.update(
      { seen: true },
      {
        where: {
          userId,
          seen: false,
        },
      }
    );

    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (err) {
    console.error("Error marking all as read:", err);
    next(err);
  }
};

const numberOfUnreadedMessage = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const numberOfNotification =  await notificationModel.findAll(
      {
        where: {
          userId,
          seen: false,
        },
      }
    );

    res.status(200).json({ success: true, nureadedMessage: numberOfNotification , message: "All notifications fetched" });
  } catch (err) {
    console.error("Error marking all as read:", err);
    next(err);
  }
};


// 🔹 Delete Notification (optional)
const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    const result = await notificationModel.destroy({
      where: {
        id: notificationId,
        userId,
      },
    });

    if (result === 0) {
      return res.status(404).json({ success: false, message: "Notification not found" });
    }

    res.status(200).json({ success: true, message: "Notification deleted" });
  } catch (err) {
    console.error("Error deleting notification:", err);
    next(err);
  }
};



const acceptGroupInvite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notificationId = req.params.id;

    // 1. Find the notification

    console.log(userId, notificationId)

    const notification = await notificationModel.findOne({
      where: {
        id: notificationId,
        userId,
        type: "invite",
      },
    });

    if (!notification) {
      return next(new ApiError(404, "Invite notification not found."));
    }

    // 2. Check if groupId is valid
    const groupId = notification.groupId;
    if (!groupId) {
      return next(new ApiError(400, "Invalid group invite (missing groupId)."));
    }

    // Optional: Check if group exists
    // const groupExists = await groupModel.findByPk(groupId);
    // if (!groupExists) return next(new ApiError(404, "Group not found."));

    // 3. Check if user is already a participant


    console.log(userId,groupId)

    const alreadyParticipant = await participantModel.findOne({
      where: { userId, groupId },
    });

    if (alreadyParticipant) {
      return res.status(200).json({
        success: true,
        message: "You are already a participant of this group.",
      });
    }

    // 4. Add user as participant
    await participantModel.create({
      userId,
      groupId,
      userType: "Member", // or whatever role is appropriate
    });

    // 5. Optionally mark the notification as read
    // seen: true ,
    await notificationModel.update(
      {status: 'accepted'},
      { where: { id: notificationId } }
    );

    return res.status(200).json({
      success: true,
      message: "You have successfully joined the group.",
    });
  } catch (err) {
    console.error("Error accepting group invite:", err);
    next(new ApiError(500, "Something went wrong while joining the group."));
  }
};

module.exports = {
  sendNotification,       // can be used in invite controller etc.
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  acceptGroupInvite,
  numberOfUnreadedMessage
};
