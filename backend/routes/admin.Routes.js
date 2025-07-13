const express = require("express");
const router = express.Router();
const { getAllUsers, getBlockedUsers, getDeletedUsers, blockUser, unblockUser, restoreUser } = require("../controler/admin.Controller");
const { isAuthenticate } = require("../middleware/auth.Middleware");

// Protect these routes with admin middleware if needed
router.get("/all", isAuthenticate , getAllUsers);
router.get("/blocked", isAuthenticate, getBlockedUsers);
router.get("/deleted", isAuthenticate, getDeletedUsers);
router.put("/block/:userId", isAuthenticate, blockUser);
router.put("/unblock/:userId", isAuthenticate , unblockUser);
router.put("/restore/:userId", isAuthenticate , restoreUser);


module.exports = router;
