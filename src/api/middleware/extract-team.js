const Action = require("../models/ActionModel");

module.exports = (req, res, next) => {
  Action.findOne({ _id: req.params.action_id })
    .then((action) => {
      if (!action) {
        return res.status(400).json({ error: "Invalid action id" });
      } else {
        req.params.team_id = action.organizer;
        next();
      }
    })
    .catch((err) => {
      if (err.name == "CastError") {
        return res.status(400).json({ error: "Invalid action id" });
      } else {
        console.error(`Error during action find():\n${err}`);
        return res.status(500).send();
      }
    });
};
