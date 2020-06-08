const express = require("express");
const router = express.Router();

const checkAuth = require("../middleware/check-auth");
const checkOwner = require("../middleware/check-owner");
const logSearch = require("../middleware/log-search");

const ActionController = require("../controllers/ActionController");
const ActionUserController = require("../controllers/ActionUserController");

/* CRUD */

router.post("/create", checkAuth, ActionController.createAction);

router.patch(
  "/:action_id",
  checkAuth,
  checkOwner,
  ActionController.updateAction
);

router.delete(
  "/:action_id",
  checkAuth,
  checkOwner,
  ActionController.cancelAction
);

router.put(
  "/:action_id/photo",
  checkAuth,
  checkOwner,
  ActionController.changePhoto
);

/* Attendants */

router.post("/:action_id/attend", checkAuth, ActionUserController.addAttendant);

router.delete(
  "/:action_id/attend",
  checkAuth,
  ActionUserController.removeAttendant
);

/* Saved Actions */

router.post("/:action_id/save", checkAuth, ActionUserController.addSavedAction);

router.delete(
  "/:action_id/save",
  checkAuth,
  ActionUserController.removeSavedAction
);

/* Search */

router.get("/search", checkAuth, logSearch, ActionController.search);

module.exports = router;
