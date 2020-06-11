const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/upload");

const UserController = require("../controllers/UserController");

/* User Profile */

router.get("/me/profile", checkAuth, UserController.getSelfProfile);

router.patch("/me/profile", checkAuth, upload, UserController.updateProfile);

router.get("/:user_id/profile", checkAuth, UserController.getProfile);

router.patch("/me/change_password", checkAuth, UserController.changePassword);

module.exports = router;
