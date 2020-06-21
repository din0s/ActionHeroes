const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const CustomError = require("../CustomError");

const Action = require("../models/ActionModel");
const Category = require("../models/CategoryModel");
const Image = require("../models/ImageModel");
const Team = require("../models/TeamModel");
const User = require("../models/UserModel");

const generateToken = (user) =>
  jwt.sign(
    // payload
    {
      userId: user._id,
    },
    // secret
    process.env.TOKEN_SECRET_KEY,
    // options
    {
      expiresIn: process.env.TOKEN_LIFE,
    }
  );

const joinUser = async (user) => {
  const promises = [];
  const response = {};

  promises.push(
    Team.find({ followers: user._id })
      .populate("categories")
      .then((teams) => {
        response[`teamsFollow`] = teams.map((team) => {
          const { _id, name, description, categories, photo } = team;
          return {
            _id,
            name,
            description,
            categories: categories.map((c) => c.name),
            photo,
          };
        });
      })
  );

  promises.push(
    Team.find({ owner: user._id })
      .populate("categories")
      .then((teams) => {
        response[`teamsOwned`] = teams.map((team) => {
          const { _id, name, description, categories, photo } = team;
          return {
            _id,
            name,
            description,
            categories: categories.map((c) => c.name),
            photo,
          };
        });
      })
  );

  promises.push(
    Action.find({ attendees: user._id })
      .populate("categories")
      .then((actions) => {
        response[`actionsAttended`] = actions.map((action) => {
          const { _id, name, description, categories, photo } = action;
          return {
            _id,
            name,
            description,
            categories: categories.map((c) => c.name),
            photo,
          };
        });
      })
  );

  promises.push(
    Action.find({ saves: user._id })
      .populate("categories")
      .then((actions) => {
        response[`actionsSaved`] = actions.map((action) => {
          const { _id, name, description, categories, photo } = action;
          return {
            _id,
            name,
            description,
            categories: categories.map((c) => c.name),
            photo,
          };
        });
      })
  );

  response[`username`] = user.username;
  response[`email`] = user.email;
  response[`bio`] = user.bio;
  response[`coordinates`] = user.coordinates;
  response[`categories`] = user.categories.map((c) => ({ name: c.name }));
  response[`photo`] = user.photo;

  try {
    await Promise.all(promises);
    return response;
  } catch (err) {
    return err;
  }
};

const authResponse = async (res, user) => {
  const join = await joinUser(user);
  if (join instanceof Error) {
    console.error(`Error during user join:\n${join}`);
    return res.status(500).send();
  }

  return res.json({
    jwt: generateToken(user),
    user: await joinUser(user),
  });
};

const findProfile = (req, res) => {
  User.findById(req.params.user_id)
    .populate("categories")
    .exec()
    .then(async (user) => {
      const join = await joinUser(user);
      if (join instanceof Error) {
        console.error(`Error during user join:\n${join}`);
        return res.status(500).send();
      }

      return res.json({
        user: join,
      });
    })
    .catch((err) => {
      console.error(`Error during user find():\n${err}`);
      return res.status(500).send();
    });
};

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
      .populate("categories")
      .exec()
      .then((user) => {
        bcrypt.compare(previousPassword, user.hash, (err, success) => {
          if (err) {
            console.error(`Error during password comparison:\n${err}`);
            return res.status(500).send();
          }

          if (success) {
            bcrypt.hash(newPassword, 10, (err, hash) => {
              if (err) {
                console.error(`Error during hashing:\n${err}`);
                return res.status(500).send();
              } else {
                user.hash = hash;
                user.save().then(async () => {
                  return await authResponse(res, user);
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

  getDashboard: (req, res) => {
    const id = req.userData.userId;
    const promises = [];
    const response = {};

    // next actions
    promises.push(
      Action.find({ attendees: { $in: [id] }, date: { $gt: new Date() } })
        .sort({ date: +1 }) // sort ascending
        .limit(3)
        .then((actions) => {
          response[`next`] = actions.map((action) => {
            const { _id, name, description, date, photo } = action;
            return { _id, name, description, date, photo };
          });
        })
        .catch((err) => {
          console.log(`Error during action find():\n${err}`);
          throw new CustomError(undefined, 500);
        })
    );

    // recommended actions
    promises.push(
      Team.find({ $or: [{ followers: { $in: [id] } }, { owner: id }] })
        .then(async (teams) => {
          // actions the user is interested in
          // because of the teams that they follow
          const followActions = await Action.find({
            organizer: { $in: teams.map((t) => t._id) },
          })
            .populate("categories")
            .exec();
          // actions the user has explicitly stated
          // that they're interested in (attend/save)
          const interestActions = await Action.find({
            $and: [
              { _id: { $nin: followActions.map((a) => a._id) } },
              { $or: [{ attendees: { $in: [id] } }, { saves: { $in: [id] } }] },
            ],
          })
            .populate("categories")
            .exec();
          response[`recommend`] = followActions
            .concat(interestActions)
            .sort((a1, a2) => a1.dateCreated < a2.dateCreated) // sort descending
            .map((action) => {
              const {
                _id,
                name,
                description,
                categories,
                location,
                date,
                photo,
              } = action;
              return {
                _id,
                name,
                description,
                categories: categories.map((c) => c.name),
                location,
                date,
                photo,
              };
            });
        })
        .catch((err) => {
          console.error(`Error during team find():\n${err}`);
          throw new CustomError(undefined, 500);
        })
    );

    // teams
    promises.push(
      Team.find({ owner: id })
        .then(async (teams) => {
          const teamActionMap = {};
          await Action.find({ organizer: { $in: teams.map((t) => t._id) } })
            .sort({ dateCreated: -1 }) // sort descending
            .then((actions) => {
              actions.forEach((action) => {
                const { organizer } = action;
                if (!teamActionMap[organizer]) {
                  const { _id, name, date } = action;
                  teamActionMap[organizer] = {
                    _id,
                    name,
                    date,
                  };
                }
              });
            })
            .then(() => {
              response[`teams`] = teams.map((team) => {
                const { _id, name, photo, followers } = team;
                return {
                  _id,
                  name,
                  photo,
                  followers: followers.length,
                  recent: teamActionMap[_id],
                };
              });
            })
            .catch((err) => {
              console.log(`Error during action find():\n${err}`);
              throw new CustomError(undefined, 500);
            });
        })
        .catch((err) => {
          console.log(`Error during team find():\n${err}`);
          throw new CustomError(undefined, 500);
        })
    );

    // saved actions
    promises.push(
      Action.find({ saves: { $in: [id] } })
        .sort({ date: +1 }) // sort ascending
        .then((actions) => {
          response[`saved`] = actions.map((action) => {
            const { _id, name, photo } = action;
            return { _id, name, photo };
          });
        })
        .catch((err) => {
          console.log(`Error during action find():\n${err}`);
          throw new CustomError(undefined, 500);
        })
    );

    Promise.all(promises)
      .then(() => res.send(response))
      .catch((err) => {
        if (err instanceof CustomError) {
          if (err.message) {
            res.status(err.code).json({ error: err.message });
          } else {
            res.status(err.code).send();
          }
        } else {
          console.log(`Error during Promise.all():\n${err}`);
          res.status(500).send();
        }
      });
  },

  getProfile: (req, res) => {
    if (req.params.user_id === req.userData.userId) {
      findProfile(req, res);
    } else {
      return res.status(401).send();
    }
  },

  getSelfProfile: (req, res) => {
    req.params.user_id = req.userData.userId;
    findProfile(req, res);
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
      .populate("categories")
      .exec()
      .then((user) => {
        if (!user) {
          return res.status(401).json({
            error: "Invalid credentials",
          });
        }

        bcrypt.compare(password, user.hash, async (err, success) => {
          if (err) {
            console.error(`Error during hash comparison:\n${err}`);
            return res.status(500).send();
          }

          if (success) {
            return await authResponse(res, user);
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
        .then(async () => {
          return await authResponse(res, user);
        })
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

  updateProfile: (req, res) => {
    const query = {};
    const promises = [];

    if (req.body.email) {
      query[`email`] = req.body.email;
    }

    if (req.body.username) {
      query[`username`] = req.body.username;
    }

    if (req.body.bio) {
      query[`bio`] = req.body.bio;
    }

    if (req.body.coordinates) {
      const coords = JSON.parse(req.body.coordinates);
      if (coords.length == 2) {
        query[`coordinates`] = coords;
      } else {
        return res.status(400).json({ error: "Invalid coordinates" });
      }
    }

    if (req.body.language) {
      query[`language`] = req.body.language;
    }

    if (req.body.categories) {
      promises.push(
        Category.find({ name: { $in: JSON.parse(req.body.categories) } }).then(
          (categories) => {
            query[`categories`] = categories.map((c) => c._id);
          }
        )
      );
    }

    if (req.file) {
      promises.push(
        new Image({
          user: req.userData.userId,
          data: req.file.buffer,
          mimeType: req.file.mimetype,
        })
          .save()
          .then((img) => {
            query[`photo`] = img._id;
          })
      );
    }

    Promise.all(promises)
      .then(() => {
        User.findOneAndUpdate(
          { _id: req.userData.userId },
          { $set: query },
          { runValidators: true, context: "query", new: true }
        )
          .populate("categories")
          .exec()
          .then(async (user) => {
            const join = await joinUser(user);
            if (join instanceof Error) {
              console.error(`Error during user join:\n${err}`);
              return res.status(500).send();
            }
            res.json({ user: join });
          })
          .catch((err) => {
            if (err.name === "ValidationError") {
              if (err.errors.email) {
                switch (err.errors.email.kind) {
                  case "unique":
                    return res
                      .status(400)
                      .json({ error: "Email isn't unique" });
                  case "regexp":
                    return res
                      .status(400)
                      .json({ error: "Invalid email address" });
                }
              }
              if (err.errors.username.kind === "unique") {
                return res.status(400).json({ error: "Username isn't unique" });
              }
            }
            console.error(`Error during user update():\n${err}`);
            res.status(500).json({ err });
          });
      })
      .catch((err) => {
        console.error(`Error during Promise.all():\n${err}`);
        res.status(500).send();
      });
  },
};
