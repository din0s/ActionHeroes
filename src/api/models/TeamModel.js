const mongo = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const TeamSchema = new mongo.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
<<<<<<< HEAD
  logo: { data: Buffer, contentType: String },
  owner: { type: mongo.Schema.Types.ObjectId, required: true, ref: "User" },
  members: [{ type: mongo.Schema.Types.ObjectId, ref: "User" }],
  categories: [{ type: mongo.Schema.Types.ObjectId, ref: "Category" }],
  dateCreated: { type: Date, default: Date.now },
=======
  photo: { type: String },
  owner: { type: mongo.Schema.Types.ObjectId, required: true },
  members: { type: [mongo.Schema.Types.ObjectId] },
  categories: { type: [String] }
>>>>>>> bb8f411... Team tab
});

TeamSchema.plugin(uniqueValidator);
module.exports = mongo.model("Team", TeamSchema);
