const mongo = require("mongoose");

const ContactFormSchema = new mongo.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
});

module.exports = mongo.model("ContactForm", ContactFormSchema);