const express = require("express");
const router = express.Router();
const dailyReportModel = require("./../models/cases");



async function getAllCaseCount(req, res) {

    try {
        let cases = [];
        let countryFilter = req.query.country
        if (countryFilter) {
            cases = await dailyReportModel.dailyReportModel.aggregate([
                { $match: { Country: countryFilter } },
                { $group: { _id: "$all", confirmed: { $sum: "$Confirmed" }, deaths: { $sum: "$Deaths" }, recovered: { $sum: "$Recovered" } } },
                { $project: { "_id": 0, "confirmed": 1, "deaths": 1, "recovered": 1 } }
            ]);
            if (cases.length == 0) {
                let errorMessage = {
                    code: 404,
                    message: `No data found for given ${countryFilter} country`
                };
                return res.status(404).send(errorMessage);
            }
        }
        else {
            cases = await dailyReportModel.dailyReportModel.aggregate([
                { $group: { _id: "$all", confirmed: { $sum: "$Confirmed" }, deaths: { $sum: "$Deaths" }, recovered: { $sum: "$Recovered" } } },
                { $project: { "_id": 0, "confirmed": 1, "deaths": 1, "recovered": 1 } }
            ])
        }
        res.send(cases[0]);
    } catch (ex) {
        for (field in ex.errors) {
            console.log(ex.errors[field].message);
        }
    }
}


//route handler function
router.get('/', getAllCaseCount);


module.exports = router;