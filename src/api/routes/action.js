const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkAuthOptional = require("../middleware/check-auth-optional");
const checkOwner = require("../middleware/check-owner");
const extractTeam = require("../middleware/extract-team");
const upload = require("../middleware/upload")(1920, 1080); // resize images to 1920x1080

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

/* GET */

router.get("/", ActionController.getAll);

router.get("/:action_id", checkAuthOptional, ActionController.getAction);

module.exports = router;
