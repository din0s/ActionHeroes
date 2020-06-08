const Team = require("../models/TeamModel");

module.exports = (req, res, next) => {
  Team.findOne({ _id: req.params.team_id })
    .then((team) => {
      if (!team) {
        return res.status(400).json({ error: "Invalid team id" });
      } else if (team.owner == req.userData.userId) {
        next();
      } else {
        return res.status(403).json({
          error: "Insufficient permissions",
        });
      }
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).json({ error: "Invalid team id" });
      } else {
        console.error(`Error during team find():\n${err}`);
        return res.status(500).send();
      }
    });
};
