const Action = require("../models/ActionModel");
const Team = require("../models/TeamModel");
const Category = require("../models/CategoryModel");

module.exports = {
  approveAction: (req, res) => {},

  cancelAction: (req, res) => {},

  changePhoto: (req, res) => {},

  createAction: (req, res) => {
    const action = new Action();
    var promises = [];

    if (req.body.name) {
      action[`name`] = req.body.name;
    } else {
      return res.status(400).json({ error: "Field `name` is required" });
    }

    if (req.body.date) {
      action[`date`] = req.body.date;
    } else {
      return res.status(400).json({ error: "Field `date` is required" });
    }

    action[`description`] = req.body.description;

    if (req.body.categories) {
      const categories = req.body.categories;
      promises.push(
        Category.find({ name: { $in: categories } }).then((categories) => {
          action[`categories`] = categories.map((c) => c._id);
        })
      );
    }

    if (req.body.team) {
      promises.push(
        Team.findOne({ name: req.body.team }).then((team) => {
          if (team) {
            action[`organizer`][`teamId`] = team._id;
          } else {
            return res.status(400).json({ error: "Invalid organizer" });
          }
        })
      );
    } else {
      action[`organizer`][`userId`] = req.userData.userId;
    }

    if (req.body.location) {
      const coordinates = req.body.location.coordinates;

      if (req.body.location.name) {
        action[`location`][`name`] = req.body.location.name;
      } else {
        return res
          .status(400)
          .json({ error: "Field `location.name` is required" });
      }

      if (coordinates) {
        if (coordinates.length == 2) {
          action[`location`][`coordinates`] = coordinates;
        } else {
          return res.status(400).json({ error: "Invalid coordinates" });
        }
      } else {
        return res
          .status(400)
          .json({ error: "Field `location.coordinates is required" });
      }
    } else {
      return res.status(400).json({ error: "Field `location` is required" });
    }

    Promise.all(promises).then(() => {
      action
        .save()
        .then(() => {
          action.__v = undefined;
          return res.status(201).send(action);
        })
        .catch((err) => {
          if (err.name == "ValidationError") {
            if (err.errors.date) {
              if (err.errors.date.kind == "Date") {
                return res.status(400).json({ error: "Date is invalid" });
              }
            }

            if (err.errors.name) {
              if (err.errors.name.kind == "unique") {
                return res
                  .status(400)
                  .json({ error: "Action name not available" });
              }
            }

            console.error(`Error during action save():\n${err}`);
            return res.status(500).send();
          }

          console.error(`Error during action save():\n${err}`);
          return res.status(500).send();
        });
    });
  },

  declineAction: (req, res) => {},

  search: (req, res) => {},

  updateAction: (req, res) => {},
};
