const mongo = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = new mongo.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  profilePhoto: { type: String },
  location: {
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number]
    }
  },
  favoriteCategories: { type: [mongo.Schema.Types.ObjectId] },
  language: { type: String },
  actionsAttended: { type: [mongo.Schema.Types.ObjectId] },
  actionsSaved: { type: [mongo.Schema.Types.ObjectId] }
});

UserSchema.plugin(uniqueValidator);
module.exports = mongo.model("User", UserSchema);
