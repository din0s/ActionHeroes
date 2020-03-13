const mongo = require("mongoose");
// const EventSchema = require('./EventModel');

const UserSchema = new mongo.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  hash: { type: String, required: true },
  hometown: { type: String }
  // favoriteEventTypes: { type: [eventTypes] },
  // language: { type: languages },
});

// const eventTypes = {
//     ENVIRONMENT: 'environment',
//     STUDENT: 'student',
//     ANIMALS: 'animals',
//     ARTS: 'arts',
//     CULTURE: 'culture',
//     HUNGER: 'hunger',
//     HEALTH: 'health'
// }

// const languages = {
//     ENGLISH: 'en',
//     GREEK: 'ελ'
// }

module.exports = mongo.model("User", UserSchema);
