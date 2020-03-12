const mongo = require("@metamodules/mongo")().base;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/UserModel");

const generateToken = user => {
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
};

module.exports = {
  login: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    UserModel.findOne({ email: email })
      .exec()
      .then(user => {
        if (!user) {
          return res.status(401).json({
            error: "Invalid credentials"
          });
        }

        bcrypt.compare(password, user.password, (err, success) => {
          if (err) {
            return res.status(500).send();
          }

          if (success) {
            // user = user.toJSON();
            // user._id = undefined;
            // user.password = undefined;
            // user.__v = undefined;
            console.log(user);

            return res.status(200).json({
              token: generateToken(user),
              user: user
            });
          }

          return res.status(401).json({
            error: "Invalid credentials"
          });
        });
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  },

  signup: (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    UserModel.find({ email: email })
      .exec()
      .then(user => {
        if (user.length == 1) {
          return res.status(409).json({
            message: "Email already exists!"
          });
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
              return res.status(400).json({
                error: "Invalid request"
              });
            } else {
              const user = new UserModel({
                _id: new mongo.Types.ObjectId(),
                email: email,
                password: hash
              });

              user
                .save()
                .then(() => {
                  res.status(201).json({
                    token: generateToken(user),
                    user: user
                  });
                })
                .catch(() => {
                  res.status(500).json({
                    error: "Invalid credentials"
                  });
                });
            }
          });
        }
      })
      .catch(err => {
        res.status(500).json({
          error: err
        });
      });
  }
};
