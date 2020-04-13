const Team = require("../models/TeamModel");

module.exports = {
  addMembers: (req, res) => {},

  createTeam: (req, res) => {
    const name = req.body.name;

    Team.find({ name })
      .then(team => {
        if (team.length == 1) {
          return res.status(409).json({
            message: "Name not available."
          });
        }

        team = new Team({
          owner: req.userData.userId
        });

        Team.schema.eachPath(path => {
          if (req.body[path]) {
            team[`${path}`] = req.body[path];
          }
        });

        team
          .save()
          .then(() => res.status(201).send())
          .catch(err => {
            console.error(`Error during team save():\n${err}`);
            res.status(400).json(err);
          });
      })
      .catch(err => {
        console.error(`Error during team find():\n${err}`);
        res.status(500).send();
      });
  },

  deleteMembers: (req, res) => {},

  deleteTeam: (req, res) => {},

  search: (req, res) => {},

  updateTeam: (req, res) => {}
};
