const express = require("express");
const mongo = require("mongoose");
require("dotenv").config();
require("dotenv-defaults").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const teamRoutes = require("./routes/team");
const eventRoutes = require("./routes/event");

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

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/team", teamRoutes);
app.use("/event", eventRoutes);

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
      error: error.message
    });
  } else {
    res.send();
  }
});

// Start server
app.listen(port, () => console.log(`Backend API listening on port ${port}!`));
