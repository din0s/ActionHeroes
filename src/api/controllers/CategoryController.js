const Category = require("../models/CategoryModel");

module.exports = {
  getAll: (_, res) => {
    Category.find().then((categories) => {
      res.json({ categories: categories.map((c) => c.name) });
    });
  },
};
