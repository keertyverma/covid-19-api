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

const dailyReportModel = mongoose.model("dailyreport", dailyReport, "dailyreport");
exports.dailyReportModel = dailyReportModel;