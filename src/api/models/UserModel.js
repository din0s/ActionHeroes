const mongo = require("mongoose");

const UserSchema = new mongo.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  username: { type: String, required: true },
  hash: { type: String, required: true },
  profilePhoto: { type: String },
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
  favoriteCategories: { type: [mongo.Schema.Types.ObjectId] },
  language: { type: String },
  actionsAttended: { type: [mongo.Schema.Types.ObjectId] },
  actionsSaved: { type: [mongo.Schema.Types.ObjectId] }
});

// const actionTypes = ['environment','student','animals','arts','culture','hunger','health'];

// const languages = ['en','ελ']

module.exports = mongo.model("User", UserSchema);
