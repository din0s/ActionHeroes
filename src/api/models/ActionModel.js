const mongo = require("mongoose");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");

const ActionSchema = new mongo.Schema({
  name: { type: String, required: true },
  description: { type: String },
  categories: [{ type: mongo.Schema.Types.ObjectId, ref: "Category" }],
  location: {
    name: {
      type: String,
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
    organizerId: {
      type: mongo.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    isTeam: { type: Boolean, required: true }
  },
  attendees: [{ type: mongo.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongo.model("Action", ActionSchema);
