const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
      },
      password: { type: String, required: true },
      hometown: { type: String },
      favoriteEventTypes: { type: List(eventTypes) },
      language: { type: languages },
      isOrganizer: { type: Boolean, default: false },

})

const eventTypes = {
    ENVIRONMENT: 'environment',
    STUDENT: 'student',
    ANIMALS: 'animals',
    ARTS: 'arts',
    CULTURE: 'culture',
    HUNGER: 'hunger',
    HEALTH: 'health'
}

const languages = {
    ENGLISH: 'en',
    GREEK: 'ελ'
}

module.exports = mongoose.model('User', UserSchema);