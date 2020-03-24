const mongoose = require("mongoose");

// dailyreport schema
const dailyReport = new mongoose.Schema({
    State: String,
    Country: String,
    LastUpdate: String,
    Confirmed: Number,
    Deaths: Number,
    Recovered: Number,
    Latitude: String,
    Longitude: String
});

module.exports.dailyReport = mongoose.model("dailyreport", dailyReport, "dailyreport");