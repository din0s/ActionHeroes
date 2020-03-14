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
  hometown: { type: String },
  favoriteEventTypes: { type: [String] },
  language: { type: String },
  eventsOrganized: { type: [mongo.Schema.Types.ObjectId] },
});

// const eventTypes = ['environment','student','animals','arts','culture','hunger','health'];

// const languages = ['en','ελ']

module.exports = mongo.model("User", UserSchema);
