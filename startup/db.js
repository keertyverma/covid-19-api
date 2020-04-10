
const config = require("config"),
    mongoose = require("mongoose"),
    winston = require("winston");


module.exports = function () {
    // Connect to Database
    let dbHost = config.get("dbHost"),
        dbPort = config.get("dbPort"),
        dbName = config.get("dbName"),
        dbUsername = config.get("dbUsername"),
        dbPassword = config.get("dbPassword");

    // mongodb://username:password@host:port/database
    let dbConnectionUrl = config.has("dbConnectionString") ? config.get("dbConnectionString") : `mongodb://${dbUsername}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

    mongoose
        .connect(dbConnectionUrl, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => winston.info("Connected to Database"))
        .catch(err => winston.error("Cannot connect to db"));


}