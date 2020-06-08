const mongo = require("mongoose");

const CategorySchema = new mongo.Schema({
  name: { type: String, required: true, unique: true, index: true },
  photo: { type: String }
});

module.exports = mongo.model("Category", CategorySchema);
