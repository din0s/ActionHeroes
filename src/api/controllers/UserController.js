const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

const generateToken = (user) =>
  jwt.sign(
    // payload
    {
      userId: user._id,
      email: user.email,
    },
    // secret
    process.env.TOKEN_SECRET_KEY,
    // options
    {
      expiresIn: process.env.TOKEN_LIFE,
    }
  );

const sanitizeUser = (user) => {
  user = user.toJSON();
  user._id = undefined;
  user.hash = undefined;
  user.__v = undefined;
  return user;
};

const authResponse = (user) => ({
  jwt: generateToken(user),
  user: sanitizeUser(user),
});

module.exports = {
  changePassword: (req, res) => {
    const previousPassword = req.body.previousPassword;
    const newPassword = req.body.newPassword;

    if (!req.body.previousPassword) {
      return res.status(400).json({
        error: "Field `previousPassword` is required",
      });
    }

    if (!req.body.newPassword) {
      return res.status(400).json({
        error: "Field `newPassword` is required",
      });
    }

    User.findById({ _id: req.userData.userId })
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            error: "Invalid credentials",
          });
        }

        bcrypt.compare(previousPassword, user.hash, (err, success) => {
          if (err) {
            return res.status(500).send(err);
          }

          if (success) {
            bcrypt.hash(newPassword, 10, (err, hash) => {
              if (err) {
                console.error(`Error during hashing:\n${err}`);
                return res.status(500).send();
              } else {
                user.hash = hash;
                user.save().then(() => {
                  return res.json(authResponse(user));
                });
              }
            });
          } else {
            return res.status(401).json({
              error: "Invalid password",
            });
          }
        });
      })
      .catch((err) => {
        console.error(`Error during user find():\n${err}`);
        return res.status(500).json();
      });
  },

  changePhoto: (req, res) => {},

  getProfile: (req, res) => {
    if (req.params.user_id === req.userData.userId) {
      User.findOne({ _id: req.params.user_id })
        .exec()
        .then((user) => {
          user = sanitizeUser(user);
          return res.status(200).json({ user });
        })
        .catch((err) => {
          console.error(`Error during user find():\n${err}`);
          return res.status(500).send();
        });
    } else {
      return res.status(401).send();
    }
  },

  getSelfProfile: (req, res) => {
    res.redirect(`/users/${req.userData.userId}/profile`);
  },

  login: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!req.body.email) {
      return res.status(400).json({ error: "Field `email` is required" });
    }

    if (!req.body.password) {
      return res.status(400).json({ error: "Field `password` is required" });
    }

    User.findOne({ email })
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            error: "Invalid credentials",
          });
        }

        bcrypt.compare(password, user.hash, (err, success) => {
          if (err) {
            console.error(`Error during hash comparison:\n${err}`);
            return res.status(500).send();
          }

          if (success) {
            return res.status(200).json(authResponse(user));
          } else {
            return res.status(401).json({
              error: "Invalid credentials",
            });
          }
        });
      })
      .catch((err) => {
        console.error(`Error during login find():\n${err}`);
        return res.status(500).send();
      });
  },

  signup: (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    if (!req.body.password) {
      return res.status(400).json({ error: "Field `password` is required" });
    }

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(400).json({
          error: "Invalid request",
        });
      }

      const user = new User({
        email,
        username,
        hash,
      });

      user
        .save()
        .then(() => res.status(201).json(authResponse(user)))
        .catch((err) => {
          if (err.name === "ValidationError") {
            if (err.errors.email) {
              if (err.errors.email.kind === "regexp") {
                return res.status(400).json({ error: "Invalid email address" });
              } else if (err.errors.email.kind === "unique") {
                return res.status(400).json({ error: "Email already exists" });
              } else if (err.errors.email.kind === "required") {
                return res
                  .status(400)
                  .json({ error: "Field `email` is required" });
              }
            }

            if (err.errors.username) {
              if (err.errors.username.kind === "unique") {
                return res
                  .status(400)
                  .json({ error: "Username already exists" });
              } else if (err.errors.username.kind === "required") {
                return res
                  .status(400)
                  .json({ error: "Field `username` is required" });
              }
            }
            console.error(err);
            return res.status(500).send();
          } else {
            console.error(`Error during user save():\n${err}`);
            return res.status(500).json();
          }
        });
    });
  },

  updateProfile: (req, res) => {},
};
