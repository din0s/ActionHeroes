const mongo = require("mongoose");
require("dotenv").config();

const Category = require("../src/api/models/CategoryModel");
const categories = require("./categories");

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
  .then(() => {
    console.log("Connected to db");

    Category.find().then((results) => {
      if (results.length !== 0) {
        console.log("Already initialized");
        mongo.disconnect();
        return;
      }

      promises = [];
      console.log("Initializing");
      categories.forEach((c) => {
        promises.push(Category({ name: c }).save());
      });

      Promise.all(promises).then(() => {
        console.log("Done");
        mongo.disconnect();
      });
    });
  });
