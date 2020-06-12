const mongo = require("mongoose");

const ImageSchema = new mongo.Schema({
  user: { type: mongo.Schema.Types.ObjectId, ref: "User" },
  data: { type: Buffer, required: true },
  mimeType: String,
});

module.exports = mongo.model("Image", ImageSchema);
