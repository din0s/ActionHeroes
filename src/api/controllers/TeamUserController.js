const User = require("../models/UserModel");
const Team = require("../models/TeamModel");

const updateFollowers = (req, res, add) => {
  const userId = req.userData.userId;
  const teamId = req.params.team_id;
  var teamQuery = {};
  var userQuery = {};

  teamQuery[add ? "$addToSet" : "$pull"] = { followers: userId };
  userQuery[add ? "$addToSet" : "$pull"] = { teamsFollowing: teamId };

  Team.findOneAndUpdate({ _id: teamId }, teamQuery)
    .then((team) => {
      if (team) {
        User.findOneAndUpdate({ _id: userId }, userQuery)
          .then(() => {
            return res.status(200).send();
          })
          .catch((err) => {
            console.error(`Error during user find():\n${err}`);
            return res.status(500).send();
          });
      } else {
        return res.status(400).json({ error: "Invalid team id" });
      }
    })
    .catch(() => {
      return res.status(400).send({ error: "Invalid team id" });
    });
};

module.exports = {
  addFollower: (req, res) => {
    updateFollowers(req, res, true);
  },

  deleteFollower: (req, res) => {
    updateFollowers(req, res, false);
  },
};
