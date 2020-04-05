const express = require("express"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  config = require("config"),
  routes = require("./routes"),
  mongoose = require("mongoose");

const app = express();

// adding middleware to request process pipeline
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Set NODE_ENV var to change the env : development, testing, production, staging
if (app.get("env") == "development") {
  app.use(morgan("tiny")); //This will impact in service performance, so better to make this on only for some conditions and avoid using it in Production env
}

// Connect to Database
let dbHost = config.get("dbHost"),
  dbPort = config.get("dbPort"),
  dbName = config.get("dbName"),
  dbUsername = config.get("dbUsername"),
  dbPassword = config.get("dbPassword");

// mongodb://username:password@host:port/database
let dbConnectionUrl = `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
mongoose
  .connect(dbConnectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Database"))
  .catch(err => console.error("Cannot connect to db"));

// Port configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on Port = ${port}`);
});

app.use("/api/v1", routes.homeRouter);
app.use("/api/v1/cases", routes.caseRouter);
app.use("/api/v1/cases/country", routes.countryRouter);
app.use("/api/v1/cases/state", routes.stateRouter);
app.use("/api/v1/refresh", routes.refreshRouter);
