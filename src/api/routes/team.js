const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkOwner = require("../middleware/check-owner");
const logSearch = require("../middleware/log-search");

const TeamController = require("../controllers/TeamController");
const TeamUserController = require("../controllers/TeamUserController");

/* CRUD */

router.post("/create", checkAuth, TeamController.createTeam);

router.patch("/:team_id", checkAuth, checkOwner, TeamController.updateTeam);

router.delete("/:team_id", checkAuth, checkOwner, TeamController.deleteTeam);

router.put(
  "/:team_id/photo",
  checkAuth,
  checkOwner,
  TeamController.changePhoto
);

/* Followers */

router.post("/:team_id/follow", checkAuth, TeamUserController.addFollower);

router.delete("/:team_id/follow", checkAuth, TeamUserController.deleteFollower);

/* Search */

router.get("/search", checkAuth, logSearch, TeamController.search);

module.exports = router;
