const routes = require("../routes"),
    express = require("express"),
    error = require("../middleware/error");

module.exports = function (app) {
    // adding middleware to request process pipeline
    app.use(express.urlencoded({ extended: true }));
    app.use("/api/v1/cases", routes.caseRouter);
    app.use("/api/v1/cases/country", routes.countryRouter);
    app.use("/api/v1/cases/state", routes.stateRouter);
    app.use("/api/v1/refresh", routes.refreshRouter);
    //error handling middleware : Add all other middleware before this
    app.use(error);
}