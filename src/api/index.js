const express = require("express");
const mongo = require("mongoose");
const morgan = require("morgan");
const rfs = require("rotating-file-stream");
const path = require("path");

require("dotenv").config();
require("dotenv-defaults").config();

const actionRoutes = require("./routes/action");
const authRoutes = require("./routes/auth");
const teamRoutes = require("./routes/team");
const userRoutes = require("./routes/user");
const contactRoutes = require("./routes/contact");

const app = express();
const port = 4000;

// Database init connection
const dbUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const dbPass = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbHost = process.env.MONGO_SERVICE_HOST;
const dbPort = process.env.MONGO_SERVICE_PORT;
const dbName = process.env.MONGO_INITDB_DATABASE;

mongo
  .connect(
    `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => console.log("Connected to database."))
  .catch(() => console.error("Could not connect to database!"));

// Logging
morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

var accessLogStream = rfs.createStream("access.log", {
  interval: "30d", // rotate monthly
  path: path.join(__dirname, "log"),
});

// Logging to file
app.use(
  morgan(":remote-addr :method :url :status [:date[web]] :body", {
    stream: accessLogStream,
  })
);

// Logging to console
app.use(morgan(":remote-addr :method :url :status [:date[web]] :body"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/actions", actionRoutes);
app.use("/auth", authRoutes);
app.use("/teams", teamRoutes);
app.use("/users", userRoutes);
app.use("/contact", contactRoutes);

/* Can't find the requested resourse */
app.use((req, res, next) => {
  const error = new Error("Resource not found");
  error.status = 404;
  next(error);
});

/* Any other error */
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  if (error.status) {
    res.json({
      error: error.message,
    });
  } else {
    res.send();
  }
});

// Start server
app.listen(port, () => console.log(`Backend API listening on port ${port}!`));
