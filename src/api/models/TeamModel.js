const mongo = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const TeamSchema = new mongo.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  logo: { data: Buffer, contentType: String },
  owner: { type: mongo.Schema.Types.ObjectId, required: true, ref: "User" },
  members: [{ type: mongo.Schema.Types.ObjectId, ref: "User" }],
  categories: [{ type: mongo.Schema.Types.ObjectId, ref: "Category" }],
  dateCreated: { type: Date },
});

TeamSchema.plugin(uniqueValidator);
module.exports = mongo.model("Team", TeamSchema);
