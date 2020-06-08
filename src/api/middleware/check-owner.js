const Team = require("../models/TeamModel");

module.exports = (req, res, next) => {
  Team.findOne({ _id: req.params.team_id })
    .then((team) => {
      if (team.owner == req.userData.userId) {
        next();
      } else {
        return res.status(403).json({
          error: "Insufficient permissions",
        });
      }
    })
    .catch((err) => {
      console.error(`Error during team find():\n${err}`);
      res.status(500).send();
    });
};
