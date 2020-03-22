const mongo = require("mongoose");

const ActionSchema = new mongo.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: { type: [mongo.Schema.Types.ObjectId] },
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
  date: { type: Date, required: true },
  photo: { type: String },
  organizer: {
    required: true,
    organizerId: { type: mongo.Schema.Types.ObjectId },
    isTeam: { type: Boolean }
  },
  attendees: { type: [mongo.Schema.Types.ObjectId] }
});

module.exports = mongo.model("Action", ActionSchema);
