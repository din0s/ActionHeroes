const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const upload = require("../middleware/upload")(240, 240); // resize files to 240x240

const UserController = require("../controllers/UserController");

/* User Profile */

router.get("/me/profile", checkAuth, UserController.getSelfProfile);

router.patch("/me/profile", checkAuth, upload, UserController.updateProfile);

router.get("/:user_id/profile", checkAuth, UserController.getProfile);

router.patch("/me/change_password", checkAuth, UserController.changePassword);

/* Dashboard */

router.get("/me/dashboard", checkAuth, UserController.getDashboard);

module.exports = router;
