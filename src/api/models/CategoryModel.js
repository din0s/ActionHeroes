const mongo = require("mongoose");

const CategorySchema = new mongo.Schema({
  name: { type: String, required: true }
});

module.exports = mongo.model("Category", CategorySchema);
