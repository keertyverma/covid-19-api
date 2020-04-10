require("express-async-errors");
const winston = require("winston"),
    morgan = require("morgan");

module.exports = function (app) {
    // logging errors
    winston.add(new winston.transports.File({ filename: "logfile.log" }));
    winston.add(new winston.transports.Console, {

        prettyPrint: true,
        colorize: true
    });

    // handles uncaught exceptions and promise rejections
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: "uncaughtException.log" }));

    process.on("unhandledRejection", (ex) => {
        throw ex;
    });

    // Set NODE_ENV var to change the env: development, testing, production, staging
    if (app.get("env") !== "production") {
        app.use(morgan("tiny")); //This will impact in service performance, so better to make this on only for some conditions and avoid using it in Production env
    }

}