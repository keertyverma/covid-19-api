const mongoose = require("mongoose");

const dailyReport = new mongoose.Schema({
    _id: String,
    FIPS: Number,
    Admin2: String,
    Province_State: String,
    Country_Region: String,
    Last_Update: String,
    Lat: Number,
    Long_: Number,
    Confirmed: Number,
    Deaths: Number,
    Recovered: Number,
    Active: Number
});

module.exports.dailyReport = mongoose.model("dailyreport", dailyReport, "dailyreport");