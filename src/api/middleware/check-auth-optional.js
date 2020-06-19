const jwt = require("jsonwebtoken");

module.exports = (req, _, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    req.userData = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    next();
  } catch (error) {
    req.userData = {};
    next();
  }
};
