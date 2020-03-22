const express = require("express");
const router = express.Router();
const dailyReportModel = require("./../models/cases");



async function getAllCaseCount(req, res) {
    try {
        let allCasesCount = {}
        let cases = []
        let countryFilter = req.query.country

        if (countryFilter) {
            console.log("Query param is passed");
            cases = await dailyReportModel.dailyReportModel.find({ Country: countryFilter }).select({ Confirmed: 1, Deaths: 1, Recovered: 1 });
            //console.log(typeof cases);
            //console.log(cases)
            //if (!cases) return res.status(404).send(`cases for ${countryFilter} is not found.`);


        }
        else {
            console.log("Query param is not passed");
            cases = await dailyReportModel.dailyReportModel.find().select({ Confirmed: 1, Deaths: 1, Recovered: 1 });
        }
        let confirmedCount = 0;
        let deathCount = 0;
        let recoveredCount = 0;

        cases.forEach(element => {
            confirmedCount += element.Confirmed;
            deathCount += element.Deaths;
            recoveredCount += element.Recovered;

        });

        allCasesCount = {
            confirmed: confirmedCount,
            deaths: deathCount,
            recovered: recoveredCount
        }


        res.send(allCasesCount);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
}


//route handler function
router.get('/', getAllCaseCount);


module.exports = router;