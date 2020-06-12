const mongo = require("mongoose");

const sanitize = (document, objects) => {
  if (document instanceof mongo.Document) {
    document = document.toJSON();
  }

  objects.forEach((ob) => {
    document[ob] = undefined;
  });

  return document;
};

module.exports = sanitize;
