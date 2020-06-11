const mongo = require("mongoose");

const ImageSchema = new mongo.Schema({
  data: { type: Buffer, required: true },
  mimeType: String,
});

module.exports = mongo.model("Image", ImageSchema);
