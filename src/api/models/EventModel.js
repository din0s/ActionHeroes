const mongo = require("mongoose");
const UserSchema = require("./UserModel");

const EventSchema = new mongo.Schema({
  _id: mongo.Schema.Types.ObjectId,
  name: { type: String, required: true },
  organizer: { type: UserSchema },
  date: { type: String, required: true },
  location: { type: String },
  eventType: { type: String },
  description: { type: String },
  participants: { type: [UserSchema] }
});
