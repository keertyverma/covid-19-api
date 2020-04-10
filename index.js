const express = require("express"),
  winston = require("winston");

const app = express();
require("./startup/logging")(app);
require("./startup/routes")(app);
require("./startup/db")();
if (app.get("env") === "production") {
  require("./startup/prod")(app);
}

// Port configuration
const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Listening on Port = ${port}`);
});
