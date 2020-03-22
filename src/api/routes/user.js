const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");

const UserController = require("../controllers/UserController");

/* User Profile */

router.get(
  "/me/profile",
  checkAuth,
  UserController.getSelfProfile,
  UserController.getProfile
);

router.patch("/me/profile", checkAuth, UserController.updateProfile);

router.get("/:user_id/profile", checkAuth, UserController.getProfile);

router.patch("/me/change_password", checkAuth, UserController.changePassword);

module.exports = router;
