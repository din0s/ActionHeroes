const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkAuthOptional = require("../middleware/check-auth-optional");
const checkOwner = require("../middleware/check-owner");
const extractTeam = require("../middleware/extract-team");
const logSearch = require("../middleware/log-search");
const upload = require("../middleware/upload")(720, 405); // resize images to 720x405

const ActionController = require("../controllers/ActionController");

/* CRUD */

router.post("/create", checkAuth, upload, ActionController.createAction);

router.patch(
  "/:action_id",
  checkAuth,
  extractTeam,
  checkOwner,
  upload,
  ActionController.updateAction
);

router.delete(
  "/:action_id",
  checkAuth,
  extractTeam,
  checkOwner,
  ActionController.cancelAction
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

router.get("/", ActionController.getAll);

router.get("/:action_id", checkAuthOptional, ActionController.getAction);

module.exports = router;
