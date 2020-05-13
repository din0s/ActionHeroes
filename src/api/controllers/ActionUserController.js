const Action = require("../models/ActionModel");
const User = require("../models/UserModel");
const mongo = require("mongoose");

mongo.set("useFindAndModify", false);

module.exports = {
  addAttendant: (req, res) => {
    const userId = req.userData.userId;
    const actionId = req.params.action_id;

    Action.findOneAndUpdate(
      { _id: actionId },
      { $addToSet: { attendees: userId } }
    )
      .then((action) => {
        if (action) {
          User.findOneAndUpdate(
            { _id: userId },
            { $addToSet: { actionsAttended: actionId } }
          )
            .then(() => {
              return res.status(201).send();
            })
            .catch((err) => {
              console.error(`Error during user find():\n${err}`);
              return res.status(500).send();
            });
        } else {
          return res.status(400).json({ error: "This action doesn't exist" });
        }
      })
      .catch(() => {
        return res.status(400).send({ error: "Invalid action id" });
      });
  },

  addSavedAction: (req, res) => {},

  removeAttendant: (req, res) => {},

  removeSavedAction: (req, res) => {},
};
