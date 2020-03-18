const mongo = require("mongoose");

const TeamSchema = new mongo.Schema({
    name: { type: String, required: true },
    description: { type: String },
    logo: { type: String },
    owner: { type: mongo.Schema.Types.ObjectId },
    members: { type: [mongo.Schema.Types.ObjectId] },
    eventTypes: { type: [String] },
});

module.exports = mongo.model("Team", TeamSchema);
