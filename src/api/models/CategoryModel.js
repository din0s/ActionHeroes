const mongo = require("mongoose");

const CategorySchema = new mongo.Schema({
  name: { type: String, required: true },
  photo: { type: String }
});

module.exports = mongo.model("Category", CategorySchema);
