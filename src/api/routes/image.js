const express = require("express");
const router = express.Router();

const ImageController = require("../controllers/ImageController");

router.get("/:id", ImageController.get);

module.exports = router;
