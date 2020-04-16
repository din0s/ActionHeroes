const Team = require("../models/TeamModel");
const Category = require("../models/CategoryModel");

module.exports = {
  addMembers: (req, res) => {},

  createTeam: (req, res) => {
    const team = new Team();
    const promises = [];

    if (req.body.name) {
      team[`name`] = req.body.name;
    } else {
      return res.status(400).json({ error: "Field `name` is required" });
    }

    team[`description`] = req.body.description || null;
    team[`owner`] = req.userData.userId;

    if (req.body.categories) {
      const categories = req.body.categories;
      promises.push(
        Category.find({ name: { $in: categories } }).then((categories) => {
          categories.forEach((category) => {
            team[`categories`].push(category._id);
          });
        })
      );
    }

    Promise.all(promises).then(() => {
      team
        .save()
        .then(() => {
          return res.status(201).send(team);
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

  deleteMembers: (req, res) => {},

  deleteTeam: (req, res) => {},

  search: (req, res) => {},

  updateTeam: (req, res) => {},
};
