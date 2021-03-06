const express = require("express");
const router = express.Router();

const ContactFormController = require("../controllers/ContactFormController");

router.post("/submit", ContactFormController.contact);

module.exports = router;
