const ContactForm = require("../models/ContactFormModel");

module.exports = {
  contact: (req, res) => {
    const contactForm = new ContactForm({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      message: req.body.message
    });

    contactForm
      .save()
      .then(() => {
        res.status(201).send();
      })
      .catch(err => {
        if (err.errors.email) {
          if (err.errors.email.kind === "regexp") {
            res.status(500).json({ error: "Invalid email address" });
          }
          res.status(500).json(err);
        } else {
          console.error(`Error during contactForm save():\n${err}`);
          res.status(500).json(err);
        }
      });
  }
};
