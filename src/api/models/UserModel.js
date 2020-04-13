const mongo = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Team = require("../models/TeamModel");

const UserSchema = new mongo.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  profilePhoto: { data: Buffer, contentType: String },
  bio: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
    },
  },
  favoriteCategories: [{ type: mongo.Schema.Types.ObjectId, ref: "Category" }],
  language: { type: String },
  actionsAttended: [{ type: mongo.Schema.Types.ObjectId, ref: "Action" }],
  actionsSaved: [{ type: mongo.Schema.Types.ObjectId, ref: "Action" }],
  teamsJoined: [{ type: mongo.Schema.Types.ObjectId, ref: "Team" }],
  teamsOwned: [{ type: mongo.Schema.Types.ObjectId, ref: "Team" }],
});

UserSchema.plugin(uniqueValidator);
module.exports = mongo.model("User", UserSchema);
