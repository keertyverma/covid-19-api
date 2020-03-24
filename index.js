const express = require("express"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  startupDebugger = require("debug")("app:startup"),
  config = require("config"),
  home = require("./routes/home"),
  routes = require("./routes"),
  country = require("./routes/country"),
  state = require("./routes/state"),
  mongoose = require("mongoose");

const app = express();

// adding middleware to request process pipeline
//app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Set NODE_ENV var to change the env : development, testing, production, staging
if (app.get("env") == "development") {
  app.use(morgan("tiny")); //This will impact in service performance, so better to make this on only for some conditions and avoid using it in Production env
  startupDebugger("Morgan enabled ...");
}

// Connect to Database
mongoose
  .connect("mongodb://127.0.0.1/covid19", { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to Database"))
  .catch(err => console.error("Cannot connect to db"));

// Configuration
console.log(`App name: ${config.get("name")}`);
console.log(`Host : ${config.get("host")}`);

// Port configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on Port = ${port}`);
});

app.use("/api/v1", home);
app.use("/api/v1/cases", routes.caseRouter);
app.use("/api/v1/cases/country", routes.countryRouter);
app.use("/api/v1/cases/state", routes.stateRouter);
