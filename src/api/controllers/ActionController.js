const Action = require("../models/ActionModel");

module.exports = {
  approveAction: (req, res) => {},

  cancelAction: (req, res) => {},

  createAction: (req, res) => {
    const name = req.body.name;

    Action.find({ name })
      .then(action => {
        if (action.length == 1) {
          return res.status(409).json({
            message: "Name not available."
          });
        }

        action = new Action();
        if (req.body.organizer) {
          action[`organizer`][`organizerId`] = req.userData.userId;
          action[`organizer`][`isTeam`] = req.body.organizer.isTeam;
        }

        if (req.body.location) {
          action[`location`][`name`] = req.body.location.name;
          action[`location`][`coordinates`] = req.body.location.coordinates;
        }

        Action.schema.eachPath(path => {
          if (req.body[path]) {
            action[`${path}`] = req.body[path];
          }
        });

        action
          .save()
          .then(() => res.status(201).send())
          .catch(err => {
            console.error(`Error during action save():\n${err}`);
            res.status(400).json(err);
          });
      })
      .catch(err => {
        console.error(`Error during action find():\n${err}`);
        res.status(500).send();
      });
  },

  declineAction: (req, res) => {},

  search: (req, res) => {},

  updateAction: (req, res) => {}
};
