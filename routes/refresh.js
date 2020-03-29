const express = require("express"),
    router = express.Router(),
    dailyReportModel = require("../models/dailyreport"),
    request = require('request'),
    date = require("date-and-time");

async function updateDBData() {


}

async function updateData(req, res) {

    try {
        // fetch first row from db collection and get current_date
        const oneRowData = await dailyReportModel.dailyReport.findOne().select({ LastUpdate: 1 });
        currentDBFileDate = ((oneRowData.LastUpdate).split("T"))[0] // date format: YYYY-MM-DD
        lastUpdateDBDate = currentDBFileDate;
        console.log(`currentDBFileDate  = ${currentDBFileDate}`);
        // call to github repo and get content from path where all csv file is present
        const options = {
            'method': 'GET',
            'url': 'https://api.github.com/repos/CSSEGISandData/COVID-19/contents/csse_covid_19_data/csse_covid_19_daily_reports',
            'headers': {
                'User-Agent': "keertyverma"
            }
        };

        request(options, function (error, response) {
            if (error) throw new Error(error);
            const data = JSON.parse(response.body)
            // get last updated file and fetch its date
            const lastUpdatedGitFile = data[data.length - 2];
            let currentGitFileDate = lastUpdatedGitFile.name; // date format: MM-DD-YYYY
            currentGitFileDate = currentGitFileDate.replace(".csv", "");
            console.log(`currentGitFileDate = ${currentGitFileDate}`);
            // compare current_db_date to current_git_date
            currentDBFileDate = date.parse(currentDBFileDate, "YYYY-MM-DD");
            currentGitFileDate = date.parse(currentGitFileDate, "MM-DD-YYYY");

            if (currentDBFileDate.getTime() === currentGitFileDate.getTime()) {
                console.log("Data is up-to-date");
                return res.send({ lastUpdate: lastUpdateDBDate });
            }
            else {
                // get respective data and update in db
                console.log("Data is not up-to-date!!!");
                downloadURL = lastUpdatedGitFile.download_url
                var options2 = {
                    'method': 'GET',
                    'url': downloadURL,
                    'headers': {
                        'User-Agent': "keertyverma"
                    }
                };
                request(options2, function (error, response2) {
                    if (error) throw new Error(error);
                    csv_data = response2.body
                    console.log(response2.body);



                })


                return res.send({ lastUpdate: lastUpdateDBDate });

            }

        });






        //res.send(oneRowData);

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