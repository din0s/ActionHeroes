const mongo = require("mongoose");

const SearchSchema = new mongo.Schema(
  {
    user_id: { type: mongo.Schema.Types.ObjectId, required: true },
    query: { type: String, required: true }
  },
  { _id: false }
);

module.exports = mongo.model("Search", SearchSchema);
