const express = require("express");
const { isAuthenticate } = require("../middleware/auth.Middleware");
const { sendInviteNotification } = require("../controler/inviteNotification.Controller");
const { getNotifications, acceptGroupInvite, markAllAsRead, numberOfUnreadedMessage } = require("../controler/notification.Controller");
const router = express.Router();

router.post("/invite", isAuthenticate, sendInviteNotification);
router.get("/allNotifications", isAuthenticate, getNotifications);
router.patch("/acceptInvitation/:id", isAuthenticate, acceptGroupInvite);
router.get("/makeAllAsRead", isAuthenticate, markAllAsRead);
router.get("/unreadedCount", isAuthenticate, numberOfUnreadedMessage);






// acceptGroupInvite

// markAllAsRead
// allNotifications
// allNotifications

module.exports = router;
