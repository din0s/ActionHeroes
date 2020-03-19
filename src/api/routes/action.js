const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkAdmin = require("../middleware/check-admin");
const checkPermissions = require("../middleware/check-permissions");
const ActionController = require("../controllers/ActionController");
const ActionUserController = require("../controllers/ActionUserController");

/* CRUD */

router.post("/create", checkAuth, ActionController.createAction);

router.patch(
  "/:action_id",
  checkAuth,
  checkPermissions,
  ActionController.updateAction
);

router.delete(
  "/:action_id",
  checkAuth,
  checkPermissions,
  ActionController.cancelAction
);

/* Admin */

router.post(
  "/:action_id/approve",
  checkAuth,
  checkAdmin,
  ActionController.approveAction
);

router.post(
  "/:action_id/decline",
  checkAuth,
  checkAdmin,
  ActionController.declineAction
);

/* Attendants */

router.post(
  "/:action_id/attendees/:user_id",
  checkAuth,
  ActionUserController.addAttendant
);

router.delete(
  "/:action_id/attendees/:user_id",
  checkAuth,
  ActionUserController.removeAttendant
);

/* Saved Actions */

router.post(
  "/:action_id/saved/:user_id",
  checkAuth,
  ActionUserController.addSavedAction
);

router.delete(
  "/:action_id/saved/:user_id",
  checkAuth,
  ActionUserController.removeSavedAction
);

module.exports = router;
