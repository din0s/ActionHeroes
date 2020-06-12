const CustomError = require("../CustomError.js");

const Action = require("../models/ActionModel");
const Category = require("../models/CategoryModel");
const Image = require("../models/ImageModel");
const Team = require("../models/TeamModel");

const updateList = (req, res, add, list) => {
  const query = {
    [add ? "$addToSet" : "$pull"]: { [list]: req.userData.userId },
  };
  Action.findOneAndUpdate({ _id: req.params.action_id }, query)
    .then((action) => {
      action
        ? res.status(200).send()
        : res.status(400).json({ error: "Invalid action id" });
    })
    .catch(() => res.status(400).send({ error: "Invalid action id" }));
};

const updateAttendants = (req, res, add) => {
  updateList(req, res, add, "attendees");
};

const updateSaves = (req, res, add) => {
  updateList(req, res, add, "saves");
};

module.exports = {
  addAttendant: (req, res) => {
    updateAttendants(req, res, true);
  },

  addSave: (req, res) => {
    updateSaves(req, res, true);
  },

  cancelAction: (req, res) => {
    // should we check if the action is in the past?
    Action.deleteOne({ _id: req.params.action_id })
      .then(() => res.status(200).send())
      .catch((err) => {
        console.error(`Error during action delete():\n${err}`);
        res.status(500).send();
      });
  },

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
      promises.push(
        Category.find({ name: { $in: JSON.parse(req.body.categories) } }).then(
          (categories) => {
            action[`categories`] = categories.map((c) => c._id);
          }
        )
      );
    }

    if (req.body.organizer) {
      promises.push(
        Team.findOne({ _id: req.body.organizer })
          .then((team) => {
            if (team) {
              if (team.owner == req.userData.userId) {
                action[`organizer`] = team._id;
              } else {
                throw new CustomError("Insufficient permissions", 403);
              }
            } else {
              throw new CustomError("Invalid organizer", 400);
            }
          })
          .catch((err) => {
            if (err.name == "CastError") {
              throw new CustomError("Invalid organizer", 400);
            } else {
              throw err;
            }
          })
      );
    } else {
      return res.status(400).json({ error: "Field `organizer` is required" });
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
        const coords = JSON.parse(coordinates);
        if (coords.length == 2) {
          action[`location`][`coordinates`] = coords;
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

    if (req.file) {
      // apply image resizing etc here using sharp
      // https://www.npmjs.com/package/sharp
      promises.push(
        new Image({
          user: req.userData.userId,
          data: req.file.buffer,
          mimeType: req.file.mimetype,
        })
          .save()
          .then((img) => {
            action[`photo`] = img._id;
          })
      );
    }

    Promise.all(promises)
      .then(() => {
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
      })
      .catch((err) => {
        return res.status(err.code).json({ error: err.message });
      });
  },

  removeAttendant: (req, res) => {
    updateAttendants(req, res, false);
  },

  removeSave: (req, res) => {
    updateSaves(req, res, false);
  },

  search: (req, res) => {},

  updateAction: (req, res) => {
    var query = {};
    var promises = [];

    if (req.body.name) {
      query[`name`] = req.body.name;
    }

    if (req.body.description) {
      query[`description`] = req.body.description;
    }

    if (req.body.date) {
      query[`date`] = req.body.date;
    }

    if (req.body.categories) {
      promises.push(
        Category.find({ name: { $in: JSON.parse(req.body.categories) } }).then(
          (categories) => {
            query[`categories`] = categories.map((c) => c._id);
          }
        )
      );
    }

    if (req.body.location) {
      const coordinates = req.body.location.coordinates;
      const name = req.body.location.name;

      if (!name) {
        return res
          .status(400)
          .json({ error: "Field `location.name` is required" });
      } else if (!coordinates) {
        return res
          .status(400)
          .json({ error: "Field `location.coordinates is required" });
      } else {
        const coords = JSON.parse(coordinates);
        if (coords.length == 2) {
          query[`location`] = {
            name: name,
            coordinates: coords,
          };
        } else {
          return res.status(400).json({ error: "Invalid coordinates" });
        }
      }
    }

    if (req.file) {
      // apply image resizing etc here using sharp
      // https://www.npmjs.com/package/sharp
      promises.push(
        new Image({
          user: req.userData.userId,
          data: req.file.buffer,
          mimeType: req.file.mimetype,
        })
          .save()
          .then((img) => {
            query[`photo`] = img._id;
          })
      );
    }

    Promise.all(promises)
      .then(() => {
        Action.findOneAndUpdate(
          { _id: req.params.action_id },
          { $set: query },
          { runValidators: true, context: "query", new: true }
        )
          .then((action) => {
            action.__v = undefined;
            return res.status(200).send(action);
          })
          .catch((err) => {
            if (err.name == "ValidationError") {
              if (err.errors.name.kind == "unique") {
                return res
                  .status(400)
                  .json({ error: "Action name not available" });
              }
            } else {
              console.error(`Error during Action update:\n${err}`);
              return res.status(500).send();
            }
          });
      })
      .catch((err) => {
        console.error(`Error during Promises.all():\n${err}`);
        return res.status(500).send();
      });
  },
};
