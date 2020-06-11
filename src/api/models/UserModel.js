const mongo = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongo.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  },
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  photo: { type: mongo.Schema.Types.ObjectId, ref: "Image" },
  bio: { type: String },
  coordinates: { type: [Number] },
  categories: [{ type: mongo.Schema.Types.ObjectId, ref: "Category" }],
  language: { type: String },
});

UserSchema.plugin(uniqueValidator);
module.exports = mongo.model("User", UserSchema);
