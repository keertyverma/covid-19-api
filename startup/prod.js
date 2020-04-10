const helmet = require("helmet"),
    compression = require("compression");

module.exports = function (app) {
    app.use(helmet());
    app.use(compression());
}