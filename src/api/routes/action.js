const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkOwner = require("../middleware/check-owner");
const extractTeam = require("../middleware/extract-team");
const logSearch = require("../middleware/log-search");

const ActionController = require("../controllers/ActionController");

/* CRUD */

router.post("/create", checkAuth, ActionController.createAction);

router.patch(
  "/:action_id",
  checkAuth,
  extractTeam,
  checkOwner,
  ActionController.updateAction
);

router.delete(
  "/:action_id",
  checkAuth,
  extractTeam,
  checkOwner,
  ActionController.cancelAction
);

router.put(
  "/:action_id/photo",
  checkAuth,
  extractTeam,
  checkOwner,
  ActionController.changePhoto
);

/* Attendants */

router.post("/:action_id/attend", checkAuth, ActionController.addAttendant);

router.delete(
  "/:action_id/attend",
  checkAuth,
  ActionController.removeAttendant
);

/* Saved Actions */

router.post("/:action_id/save", checkAuth, ActionController.addSave);

router.delete("/:action_id/save", checkAuth, ActionController.removeSave);

/* Search */

router.get("/search", checkAuth, logSearch, ActionController.search);

module.exports = router;
