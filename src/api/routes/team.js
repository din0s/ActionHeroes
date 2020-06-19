const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkAuthOptional = require("../middleware/check-auth-optional");
const checkOwner = require("../middleware/check-owner");
const upload = require("../middleware/upload")(128, 128); // resize files to 128x128
const logSearch = require("../middleware/log-search");

const TeamController = require("../controllers/TeamController");

/* CRUD */

router.post("/create", checkAuth, upload, TeamController.createTeam);

router.patch(
  "/:team_id",
  checkAuth,
  checkOwner,
  upload,
  TeamController.updateTeam
);

router.delete("/:team_id", checkAuth, checkOwner, TeamController.deleteTeam);

/* Followers */

router.post("/:team_id/follow", checkAuth, TeamController.addFollower);

router.delete("/:team_id/follow", checkAuth, TeamController.removeFollower);

/* Search */

router.get("/search", checkAuth, logSearch, TeamController.search);

router.get("/", TeamController.getAll);

router.get("/:team_id", checkAuthOptional, TeamController.getTeam);

module.exports = router;
