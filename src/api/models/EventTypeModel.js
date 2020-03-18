const mongo = require("mongoose");

const EventTypeSchema = new mongo.Schema({
    name: { type:String, required: true },
});

module.exports = mongo.model("EventType", EventTypeSchema);