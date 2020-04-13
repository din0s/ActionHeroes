const mongo = require("mongoose");
const User = require("../models/UserModel");
const Category = require("../models/CategoryModel");

const TeamSchema = new mongo.Schema({
  name: { type: String, required: true },
  description: { type: String },
  logo: { type: String },
  owner: { type: mongo.Schema.Types.ObjectId, required: true, ref: "User" },
  members: [{ type: mongo.Schema.Types.ObjectId, ref: "User" }],
  categories: [{ type: mongo.Schema.Types.ObjectId, ref: "Category" }],
});

module.exports = mongo.model("Team", TeamSchema);
