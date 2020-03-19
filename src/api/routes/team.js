const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkOwner = require("../middleware/check-owner");
const logSearch = require("../middleware/log-search");

const TeamController = require("../controllers/TeamController");

/* CRUD */

router.post("/create", checkAuth, TeamController.createTeam);

router.patch("/:team_id", checkAuth, checkOwner, TeamController.updateTeam);

router.delete("/:team_id", checkAuth, checkOwner, TeamController.deleteTeam);

/* Members */

router.patch(
  "/:team_id/members",
  checkAuth,
  checkOwner,
  TeamController.addMembers
);

router.delete(
  "/:team_id/members",
  checkAuth,
  checkOwner,
  TeamController.deleteMembers
);

/* Search */

router.get("/search", checkAuth, logSearch, TeamController.search);

module.exports = router;
