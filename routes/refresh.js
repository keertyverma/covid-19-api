const express = require("express"),
    router = express.Router(),
    dailyReportModel = require("../models/dailyreport"),
    fetch = require("node-fetch"),
    date = require("date-and-time"),
    csv = require('csvtojson'),
    winston = require("winston");


async function updateDBData(csvdata) {

    records = await csv({ checkType: true }).fromString(csvdata)

    //update covid - 19 collection data to latest
    let bulk = await dailyReportModel.dailyReport.collection.initializeUnorderedBulkOp();
    let match = "_id"

    records.forEach(function (record) {
        let query = {};
        query[match] = record[match];
        bulk.find(query).upsert().updateOne(record);
    });

    bulk.execute(function (err, bulkres) {
        return bulkres
    });


}

async function updateData(req, res) {
    const oneRowData = await dailyReportModel.dailyReport.find({}, { 'Last_Update': 1 }).sort({ 'Last_Update': -1 }).limit(1),
        currentDBFileDate = oneRowData.length ? (oneRowData[0].Last_Update).split(" ")[0] : '1970-01-01', // date format: YYYY-MM-DD

        // call to github repo and get content from path where all csv file is present
        repoURL = 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports',
        options = {
            method: 'GET',
            headers: {
                'User-Agent': "github-user"
            }
        },

        response = await fetch(repoURL, options),
        data = await response.json(),
        lastUpdatedGitFile = data[data.length - 2],
        currentGitFileDate = lastUpdatedGitFile.name.replace(".csv", ""), // date format: MM-DD-YYYY
        formatedCurrentDBFileDate = date.parse(currentDBFileDate, "YYYY-MM-DD"),
        formatedCurrentGitFileDate = date.parse(currentGitFileDate, "MM-DD-YYYY");

    winston.info(`currentDBFileDate  = ${currentDBFileDate}`);
    winston.info(`currentGitFileDate  = ${currentGitFileDate}`);

    if (formatedCurrentDBFileDate.getTime() === formatedCurrentGitFileDate.getTime()) {
        winston.info("Data is up-to-date");
        return res.send({ message: "Data is up-to-date", lastUpdate: formatedCurrentGitFileDate.toString() });
    }

    // Refresh DB with updated data
    winston.log("info", "Data is not up-to-date !!!");
    downloadURL = lastUpdatedGitFile.download_url;
    const options2 = {
        method: 'GET',
        headers: {
            'User-Agent': "github-user"
        }
    };
    const csvresponse = await fetch(downloadURL, options2);
    let csvdata = await csvresponse.text();
    csvdata = csvdata.replace("Combined_Key", "_id")

    await updateDBData(csvdata);
    return res.send({ message: "Data is refreshed now", lastUpdate: formatedCurrentGitFileDate.toString() });
}

//route handler function
router.get('/', updateData);
module.exports = router;