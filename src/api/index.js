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
const port = process.env.PORT || 4000;

// set localhost proxy for nginx
app.set('trust proxy', '127.0.0.1');

// Database init connection
const dbUser = process.env.MONGO_INITDB_ROOT_USERNAME;
const dbPass = process.env.MONGO_INITDB_ROOT_PASSWORD;
const dbHost = process.env.MONGO_SERVICE_HOST;
const dbPort = process.env.MONGO_SERVICE_PORT;
const dbName = process.env.MONGO_INITDB_DATABASE;

const dbUri =
  process.env.MONGODB_URI ||
  `mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}?authSource=admin`;

mongo
  .connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to database."))
  .catch(() => console.error("Could not connect to database!"));

// Logging
morgan.token("body", function(req, res) {
  return JSON.stringify(req.body);
});

morgan.token("ip", (req, res) => {
  return req.ip.split(":").pop();
});

var accessLogStream = rfs.createStream("access.log", {
  interval: "30d", // rotate monthly
  path: path.join(process.cwd(), "log"),
});

const unwantedLogs = ["/static", "/img", "/locales"];

// Logging to file
app.use(
  morgan("[:date[web]] :ip :method :url :status :body", {
    stream: accessLogStream,
    skip: (req, res) => {
      return unwantedLogs.some((word) => req.url.startsWith(word));
    },
  })
);

// Logging to console
app.use(
  morgan("[:date[web]] :ip :method :url :status  :body", {
    skip: (req, res) => {
      return unwantedLogs.some((word) => req.url.startsWith(word));
    },
  })
);

mongo.set("useFindAndModify", false);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.use("/api/actions", actionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/teams", teamRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

if (process.env.NODE_ENV == "production") {
  // Serve static content in build directory
  app.use(express.static(path.join(process.cwd(), "build")));
  app.get("/*", function(req, res) {
    res.sendFile(path.join(process.cwd(), "build", "index.html"));
  });
} else {
  app.use((req, res, next) => {
    const error = new Error("Resource not found");
    error.status = 404;
    next(error);
  });
}

// Any other error
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
