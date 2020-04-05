const express = require("express"),
    router = express.Router(),
    dailyReportModel = require("../models/dailyreport"),
    fetch = require("node-fetch"),
    date = require("date-and-time"),
    csv = require('csvtojson');


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

    try {
        const oneRowData = await dailyReportModel.dailyReport.find({}, { 'Last_Update': 1 }).sort({ 'Last_Update': -1 }).limit(1);
        currentDBFileDate = ((oneRowData[0].Last_Update).split(" "))[0] // date format: YYYY-MM-DD
        lastUpdateDBDate = currentDBFileDate;

        // call to github repo and get content from path where all csv file is present
        const repoURL = 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports';
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': "keertyverma"
            }
        };

        const response = await fetch(repoURL, options);
        const data = await response.json();
        const lastUpdatedGitFile = data[data.length - 2];
        let currentGitFileDate = lastUpdatedGitFile.name; // date format: MM-DD-YYYY
        currentGitFileDate = currentGitFileDate.replace(".csv", "");
        console.log(`currentDBFileDate  = ${currentDBFileDate}`);
        console.log(`currentGitFileDate = ${currentGitFileDate}`);
        formatedCurrentDBFileDate = date.parse(currentDBFileDate, "YYYY-MM-DD");
        formatedCurrentGitFileDate = date.parse(currentGitFileDate, "MM-DD-YYYY");

        if (formatedCurrentDBFileDate.getTime() === formatedCurrentGitFileDate.getTime()) {
            console.log("Data is up-to-date");
            return res.send({ message: "Data is up-to-date", lastUpdate: formatedCurrentGitFileDate.toString() });
        }
        else {
            // Refresh DB with updated data
            console.log("Data is not up-to-date!!!");
            downloadURL = lastUpdatedGitFile.download_url;
            const options2 = {
                method: 'GET',
                headers: {
                    'User-Agent': "keertyverma"
                }
            };
            const csvresponse = await fetch(downloadURL, options2);
            let csvdata = await csvresponse.text();
            csvdata = csvdata.replace("Combined_Key", "_id")

            await updateDBData(csvdata);
            return res.send({ message: "Data is refreshed now", lastUpdate: formatedCurrentGitFileDate.toString() });

        };


    } catch (ex) {
        console.log(ex);

        return res.status(500).send({
            code: 500,
            message: 'Internal server error'
        });
    }
}

//route handler function
router.get('/', updateData);
module.exports = router;