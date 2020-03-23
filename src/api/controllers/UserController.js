const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/UserModel");

const generateToken = user =>
  jwt.sign(
    // payload
    {
      userId: user._id,
      email: user.email
    },
    // secret
    process.env.TOKEN_SECRET_KEY,
    // options
    {
      expiresIn: process.env.TOKEN_LIFE
    }
  );

const sanitizeUser = user => {
  user = user.toJSON();
  user._id = undefined;
  user.hash = undefined;
  user.__v = undefined;
  return user;
};

const authResponse = user => ({
  jwt: generateToken(user),
  user: sanitizeUser(user)
});

module.exports = {
  changePassword: (req, res) => {},

  getProfile: (req, res) => {
    if (req.params.user_id === req.userData.userId) {
      User.findOne({ _id: req.params.user_id })
        .exec()
        .then(user => {
          user = sanitizeUser(user);
          res.status(200).json({ user });
        })
        .catch(err => {
          console.error(`Error during user find():\n${err}`);
          res.status(500).send();
        });
    } else {
      res.status(401).send();
    }
  },

  getSelfProfile: (req, res) => {
    res.redirect(`/users/${req.userData.userId}/profile`);
  },

  login: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
      .then(user => {
        if (!user) {
          return res.status(401).json({
            error: "Invalid credentials"
          });
        }

        bcrypt.compare(password, user.hash, (err, success) => {
          if (err) {
            console.error(`Error during hash comparison:\n${err}`);
            return res.status(500).send();
          }

          if (success) {
            res.status(200).json(authResponse(user));
          } else {
            res.status(401).json({
              error: "Invalid credentials"
            });
          }
        });
      })
      .catch(err => {
        console.error(`Error during login find():\n${err}`);
        res.status(500).send();
      });
  },

  signup: (req, res) => {
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        return res.status(400).json({
          error: "Invalid request"
        });
      }

      const user = new User({
        email,
        username,
        hash
      });

      user
        .save()
        .then(() => res.status(201).json(authResponse(user)))
        .catch(err => {
          if (err.name === "ValidationError") {
            if (err.errors.email) {
              if (err.errors.email.kind === "regexp") {
                res.status(400).json({ error: "Invalid email address" });
              } else if (err.errors.email.kind === "unique") {
                res.status(400).json({ error: "Email already exists" });
              }
            }

            if (err.errors.username) {
              if (err.errors.username.kind === "unique") {
                res.status(400).json({ error: "Username already exists" });
              }
            }
            console.error(err);
            res.status(500).send();
          } else {
            console.error(`Error during user save():\n${err}`);
            res.status(500).json(err);
          }
        });
    });
  },

  updateProfile: (req, res) => {}
};
