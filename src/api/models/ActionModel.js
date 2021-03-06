const mongo = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ActionSchema = new mongo.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    uniqueCaseInsensitive: true,
  },
  description: { type: String, required: true },
  categories: [{ type: mongo.Schema.Types.ObjectId, ref: "Category" }],
  location: {
    name: {
      type: String,
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  date: { type: Date, required: true },
  dateCreated: { type: Date, default: Date.now },
  photo: { type: mongo.Schema.Types.ObjectId, ref: "Image" },
  organizer: { type: mongo.Schema.Types.ObjectId, ref: "Team", required: true },
  attendees: [{ type: mongo.Schema.Types.ObjectId, ref: "User" }],
  saves: [{ type: mongo.Schema.Types.ObjectId, ref: "User" }],
});

ActionSchema.plugin(uniqueValidator);
module.exports = mongo.model("Action", ActionSchema);
