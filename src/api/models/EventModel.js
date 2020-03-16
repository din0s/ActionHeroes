const mongo = require("mongoose");

const EventSchema = new mongo.Schema({

});

module.exports = mongo.model("Event", EventSchema);