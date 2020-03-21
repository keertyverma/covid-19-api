const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://127.0.0.1:27017/covid19", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   })
//   .then(console.log("Connected to DB..."))
//   .catch(console.log("Not able to connected to DB..."));

//Set up default mongoose connection
const mongoDB = "mongodb://127.0.0.1/covid19";
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));

//const Schema = mongoose.Schema;

// dailyreport schema
const dailyReport = new mongoose.Schema({
  State: String,
  Country: String,
  LastUpdate: String,
  Confirmed: String,
  Deaths: String,
  Recovered: String,
  Latitude: String,
  Longitude: String
});

const dailyReportModel = mongoose.model("dailyreport", dailyReport);
dailyReportModel.find({}, function (err, athletes) {
  if (err) return handleError(err);

// async function getReport() {
//   //   const pageNumber = 2;
//   //   const pageSize = 10;
//   const reports = await dailyReportModel.find({});
//   console.log("reports", reports);
// }

// getReport();
