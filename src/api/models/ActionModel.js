const mongo = require("mongoose");

const ActionSchema = new mongo.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: [mongo.Schema.Types.ObjectId] },
  place: { type: String },
  date: { type: String },
  photo: { type: String },
  organizer: {
    _id: { type: mongo.Schema.Types.ObjectId },
    isTeam: { type: Boolean }
  },
  attendees: { type: [mongo.Schema.Types.ObjectId] }
});

module.exports = mongo.model("action", ActionSchema);
