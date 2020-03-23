const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const startupDebugger = require("debug")("app:startup");
const config = require("config");
//const routes = require("./routes");
const home = require("./routes/home");
const cases = require("./routes/cases")
const country = require("./routes/country")
const state = require("./routes/state")

const app = express();
const mongoose = require("mongoose");


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
//const port = process.env.PORT || 3000;
const port = 3000;
app.listen(port, () => {
  console.log(`Listening on Port = ${port}`);
});

app.use("/api/v1", home);
app.use("/api/v1/cases", cases);
app.use("/api/v1/cases/country", country);
app.use("/api/v1/cases/state", state);
