const ContactForm = require("../models/ContactFormModel");

module.exports = {
  contact: (req, res) => {
    const contactForm = new ContactForm({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      message: req.body.message,
    });

    contactForm
      .save()
      .then(() => {
        return res.status(201).send();
      })
      .catch((err) => {
        if (err.errors.email) {
          if (err.errors.email.kind === "regexp") {
            return res.status(400).json({ error: "Invalid email address" });
          } else if (err.errors.email.kind === "required") {
            return res.status(400).json({ error: "Field `email` is required" });
          }
          return res.status(500).json(err);
        } else if (err.errors.firstName) {
          if (err.errors.firstName.kind === "required") {
            return res
              .status(400)
              .json({ error: "Field `firstName` is required" });
          }
          return res.status(500).json(err);
        } else if (err.errors.lastName) {
          if (err.errors.lastName.kind === "required") {
            return res
              .status(400)
              .json({ error: "Field `lastName` is required" });
          }
          return res.status(500).json(err);
        } else if (err.errors.message) {
          if (err.errors.message.kind === "required") {
            return res
              .status(400)
              .json({ error: "Field `message` is required" });
          }
          return res.status(500).json(err);
        } else {
          console.error(`Error during contactForm save():\n${err}`);
          return res.status(500).json(err);
        }
      });
  },
};
