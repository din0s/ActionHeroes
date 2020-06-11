const Image = require("../models/ImageModel");

module.exports = {
  get: (req, res) => {
    Image.findById(req.params.id)
      .then((img) => {
        if (img) {
          res.contentType(img.mimeType).send(img.data);
        } else {
          res.status(400).json({ error: "Invalid image id" });
        }
      })
      .catch((err) => {
        if (err.name === "CastError") {
          return res.status(400).json({ error: "Invalid image id" });
        }
        console.error(`Error during image find():\n${err}`);
        res.status(500).send();
      });
  },
};
