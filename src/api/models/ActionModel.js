const mongo = require("mongoose");

const ActionSchema = new mongo.Schema({
  name: { type: String, required: true },
  description: { type: String },
  type: { type: [mongo.Schema.Types.ObjectId] },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  date: { type: Date },
  photo: { type: String },
  organizer: {
    _id: { type: mongo.Schema.Types.ObjectId },
    isTeam: { type: Boolean }
  },
  attendees: { type: [mongo.Schema.Types.ObjectId] }
});

module.exports = mongo.model("action", ActionSchema);
