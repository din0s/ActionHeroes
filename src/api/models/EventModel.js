const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = require('./UserModel');

const EventSchema = new Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    organizer: { type: UserSchema },
    date: { type: String, required: true },
    location: { type: String },
    eventType: { type: String },
    description: { type: String }
});