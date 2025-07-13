// optional

const { userModel } = require("../modles/user.Models");

// Fetch all active users (not deleted)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAll({
      where: { isDeleted: false },
      attributes: { exclude: ["password"] },
    });

    console.log("here is the user details")

    res.status(200).json({
      success: true,
      message: "All active users fetched",
      users,
    });
  } catch (error) {
    console.error("Error fetching all users:", error);
    next(new ApiError(500, SERVER.INTERNALERROR));
  }
};

// Fetch all blocked users
exports.getBlockedUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAll({
      where: { isBlocked: true, isDeleted: false },
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      message: "Blocked users fetched",
      users,
    });
  } catch (error) {
    console.error("Error fetching blocked users:", error);
    next(new ApiError(500, SERVER.INTERNALERROR));
  }
};

// Fetch all deleted users
exports.getDeletedUsers = async (req, res, next) => {
  try {
    const users = await userModel.findAll({
      where: { isDeleted: true },
      attributes: { exclude: ["password"] },
    });

    res.status(200).json({
      success: true,
      message: "Deleted users fetched",
      users,
    });
  } catch (error) {
    console.error("Error fetching deleted users:", error);
    next(new ApiError(500, SERVER.INTERNALERROR));
  }
};


// Block a user
exports.blockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.update({ isBlocked: true });

    res.status(200).json({
      success: true,
      message: `User ${user.email} has been blocked.`,
    });
  } catch (error) {
    console.error("Error blocking user:", error);
    next(new ApiError(500, SERVER.INTERNALERROR));
  }
};

// Unblock a user
exports.unblockUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.update({ isBlocked: false });

    res.status(200).json({
      success: true,
      message: `User ${user.email} has been unblocked.`,
    });
  } catch (error) {
    console.error("Error unblocking user:", error);
    next(new ApiError(500, SERVER.INTERNALERROR));
  }
};

// Restore a deleted user (isDeleted: false)
exports.restoreUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findByPk(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    await user.update({ isDeleted: false });

    res.status(200).json({
      success: true,
      message: `User ${user.email} has been restored.`,
    });
  } catch (error) {
    console.error("Error restoring user:", error);
    next(new ApiError(500, SERVER.INTERNALERROR));
  }
};

