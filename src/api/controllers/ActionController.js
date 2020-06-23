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

  createAction: async (req, res) => {
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

    if (req.body.description) {
      action[`description`] = req.body.description;
    } else {
      return res.status(400).json({ error: "Field `description` is required" });
    }

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
      const location = JSON.parse(req.body.location);

      if (location.name) {
        action[`location`][`name`] = location.name;
      } else {
        return res
          .status(400)
          .json({ error: "Field `location.name` is required" });
      }

      if (location.coordinates) {
        if (location.coordinates.length == 2) {
          action[`location`][`coordinates`] = location.coordinates;
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

    try {
      await Promise.all(promises).then(() => {
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
            }

            console.error(`Error during action save():\n${err}`);
            return res.status(500).send();
          });
      });
    } catch (err) {
      if (err instanceof CustomError) {
        return res.status(err.code).json({ error: err.message });
      } else {
        console.error(`Error during Promise.all:\n${err}`);
        return res.status(500).send();
      }
    }
  },

  getAction: (req, res) => {
    Action.findOne({ _id: req.params.action_id })
      .populate("categories")
      .populate("organizer")
      .then((action) => {
        if (action) {
          const {
            _id,
            name,
            description,
            categories,
            location,
            date,
            photo,
            organizer,
            attendees,
            saves,
          } = action;
          const teamId = organizer._id;
          const teamName = organizer.name;
          const teamPhoto = organizer.photo;
          const teamOwner = organizer.owner;

          return res.json({
            _id,
            name,
            description,
            categories: categories.map((c) => c.name),
            location,
            date,
            photo,
            organizer: {
              _id: teamId,
              name: teamName,
              photo: teamPhoto,
            },
            attendees: attendees.length,
            isHost: req.userData.userId == teamOwner,
            toAttend: attendees.includes(req.userData.userId),
            saved: saves.includes(req.userData.userId),
          });
        } else {
          return res.status(400).json({ error: "Invalid action id" });
        }
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(400).json({ error: "Invalid action id" });
        }

        console.error(`Error during action find():\n${err}`);
        return res.status(500).send();
      });
  },

  getAll: (_, res) => {
    Action.find()
      .sort({ dateCreated: -1 })
      .populate("categories")
      .then((actions) => {
        res.send(
          actions.map((action) => {
            const {
              _id,
              name,
              description,
              categories,
              location,
              date,
              photo,
            } = action;

            return {
              _id,
              name,
              description,
              categories: categories.map((c) => c.name),
              location,
              date,
              photo,
            };
          })
        );
      });
  },

  removeAttendant: (req, res) => {
    updateAttendants(req, res, false);
  },

  removeSave: (req, res) => {
    updateSaves(req, res, false);
  },

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
      const location = JSON.parse(req.body.location);
      const coordinates = location.coordinates;
      const name = location.name;

      if (!name) {
        return res
          .status(400)
          .json({ error: "Field `location.name` is required" });
      } else if (!coordinates) {
        return res
          .status(400)
          .json({ error: "Field `location.coordinates is required" });
      } else {
        if (coordinates.length == 2) {
          query[`location`] = {
            name: name,
            coordinates: coordinates,
          };
        } else {
          return res.status(400).json({ error: "Invalid coordinates" });
        }
      }
    }

    if (req.file) {
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
