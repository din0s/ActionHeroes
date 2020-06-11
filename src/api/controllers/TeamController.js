const Action = require("../models/ActionModel");
const Category = require("../models/CategoryModel");
const Team = require("../models/TeamModel");
const User = require("../models/UserModel");

const updateFollowers = (req, res, add) => {
  const query = {
    [add ? "$addToSet" : "$pull"]: { followers: req.userData.userId },
  };
  Team.findOneAndUpdate({ _id: req.params.team_id }, query)
    .then((team) => {
      team
        ? res.status(200).send()
        : res.status(400).json({ error: "Invalid team id" });
    })
    .catch(() => res.status(400).send({ error: "Invalid team id" }));
};

module.exports = {
  addFollower: (req, res) => {
    updateFollowers(req, res, true);
  },

  createTeam: (req, res) => {
    const team = new Team();
    const promises = [];

    if (req.body.name) {
      team[`name`] = req.body.name;
    } else {
      return res.status(400).json({ error: "Field `name` is required" });
    }

    team[`description`] = req.body.description;
    team[`owner`] = req.userData.userId;

    if (req.body.categories) {
      const categories = req.body.categories;
      promises.push(
        Category.find({ name: { $in: categories } }).then((categories) => {
          team[`categories`] = categories.map((c) => c._id);
        })
      );
    }

    Promise.all(promises).then(() => {
      team
        .save()
        .then(() => {
          team.__v = undefined;
          User.findByIdAndUpdate(
            { _id: req.userData.userId },
            { $addToSet: { teamsOwned: team._id } }
          )
            .then(() => {
              return res.status(201).send(team);
            })
            .catch((err) => {
              console.error(`Error during user update():\n${err}`);
              return res.status(500).send();
            });
        })
        .catch((err) => {
          if (err.name == "ValidationError") {
            if (err.errors.name.kind == "unique") {
              return res.status(400).json({ error: "Team name not available" });
            }

            console.error(`Error during team save():\n${err}`);
            return res.status(500).send();
          }

          console.error(`Error during team save():\n${err}`);
          return res.status(500).send();
        });
    });
  },

  changePhoto: (req, res) => {},

  deleteTeam: (req, res) => {
    Action.exists({ organizer: req.params.team_id })
      .then((hasAction) => {
        if (hasAction) {
          res.status(405).json({ error: "An action depends on this team" });
        } else {
          Team.findById(req.params.team_id)
            .then((team) => {
              team
                .remove()
                .then(() => res.status(200).send())
                .catch((err) => {
                  console.error(`Error during team remove():\n${err}`);
                  res.status(500).send();
                });
            })
            .catch((err) => {
              console.error(`Error during team findById():\n${err}`);
              res.status(500).send();
            });
        }
      })
      .catch((err) => {
        console.error(`Error during action exists():\n${err}`);
        res.status(500).send();
      });
  },

  removeFollower: (req, res) => {
    updateFollowers(req, res, false);
  },

  search: (req, res) => {},

  updateTeam: (req, res) => {
    var query = {};
    var promises = [];

    if (req.body.name) {
      query[`name`] = req.body.name;
    }

    if (req.body.description) {
      query[`description`] = req.body.description;
    }

    if (req.body.categories) {
      promises.push(
        Category.find({ name: { $in: req.body.categories } }).then((cat) => {
          query[`categories`] = cat.map((c) => c._id);
        })
      );
    }

    Promise.all(promises)
      .then(() => {
        Team.findOneAndUpdate(
          { _id: req.params.team_id },
          { $set: query },
          { runValidators: true, context: "query", new: true }
        )
          .then((team) => {
            team.__v = undefined;
            return res.status(200).send(team);
          })
          .catch((err) => {
            if (err.name == "ValidationError") {
              if (err.errors.name.kind == "unique") {
                return res
                  .status(400)
                  .json({ error: "Team name not available" });
              }
            } else {
              console.error(`Error during Team update:\n${err}`);
              return res.status(500).send();
            }
          });
      })
      .catch((err) => {
        console.error(`Error during Promise.all():\n${err}`);
        return res.status(500).send();
      });
  },
};
