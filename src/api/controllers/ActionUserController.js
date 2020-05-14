const Action = require("../models/ActionModel");
const User = require("../models/UserModel");

const updateAttendants = (req, res, add) => {
  const userId = req.userData.userId;
  const actionId = req.params.action_id;
  var actionQuery = {};
  var userQuery = {};

  actionQuery[add ? "$addToSet" : "$pull"] = { attendees: userId };
  userQuery[add ? "$addToSet" : "$pull"] = { actionsAttended: actionId };

  Action.findOneAndUpdate({ _id: actionId }, actionQuery)
    .then((action) => {
      if (action) {
        User.findOneAndUpdate({ _id: userId }, userQuery)
          .then(() => {
            return res.status(200).send();
          })
          .catch((err) => {
            console.error(`Error during user find():\n${err}`);
            return res.status(500).send();
          });
      } else {
        return res.status(400).json({ error: "Invalid action id" });
      }
    })
    .catch(() => {
      return res.status(400).send({ error: "Invalid action id" });
    });
};

const updateSavedActions = (req, res, add) => {
  const userId = req.userData.userId;
  const actionId = req.params.action_id;

  var userQuery = {};
  userQuery[add ? "$addToSet" : "$pull"] = { actionsSaved: actionId };

  Action.findById(actionId)
    .then((action) => {
      if (action) {
        User.findOneAndUpdate({ _id: userId }, userQuery)
          .then(() => {
            return res.status(200).send();
          })
          .catch((err) => {
            console.error(`Error during user find():\n${err}`);
            return res.status(500).send();
          });
      } else {
        return res.status(400).json({ error: "Invalid action id" });
      }
    })
    .catch(() => {
      return res.status(400).send({ error: "Invalid action id" });
    });
};

module.exports = {
  addAttendant: (req, res) => {
    updateAttendants(req, res, true);
  },

  addSavedAction: (req, res) => {
    updateSavedActions(req, res, true);
  },

  removeAttendant: (req, res) => {
    updateAttendants(req, res, false);
  },

  removeSavedAction: (req, res) => {
    updateSavedActions(req, res, false);
  },
};
