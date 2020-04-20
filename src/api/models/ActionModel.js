const mongo = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const ActionSchema = new mongo.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
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
  dateCreated: { type: Date },
  photo: { data: Buffer, contentType: String },
  organizer: {
    userId: { type: mongo.Schema.Types.ObjectId, ref: "User" },
    teamId: { type: mongo.Schema.Types.ObjectId, ref: "Team" },
  },
  attendees: [{ type: mongo.Schema.Types.ObjectId, ref: "User" }],
  approved: { type: Boolean, default: false },
});

ActionSchema.plugin(uniqueValidator);
module.exports = mongo.model("Action", ActionSchema);
