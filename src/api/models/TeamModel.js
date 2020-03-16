const mongo = require("mongoose");

const TeamSchema = new mongo.Schema({
  
});

module.exports = mongo.model("Team", TeamSchema);
