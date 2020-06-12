const sanitize = (document, objects) => {
  document = document.toJSON();
  objects.forEach((ob) => {
    document[ob] = undefined;
  });

  return document;
};

module.exports = sanitize;
