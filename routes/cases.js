const express = require("express"),
    router = express.Router(),
    dailyReportModel = require("../models/dailyreport");

async function getAllCaseCount(req, res) {
    try {
        let cases = [],
            aggregates = [
                { $group: { _id: "$all", confirmed: { $sum: "$Confirmed" }, deaths: { $sum: "$Deaths" }, recovered: { $sum: "$Recovered" } } },
                { $project: { "_id": 0 } }
            ],
            countryFilter = req.query.country;

        if (countryFilter) {
            aggregates.unshift({ $match: { Country_Region: countryFilter } })
        }

        cases = await dailyReportModel.dailyReport.aggregate(aggregates)

        if (cases.length == 0) {
            return res.status(404).send({
                code: 404,
                message: `No data found for given filter[s] - ${JSON.stringify(req.query).replace(/"/g, '\'')}`
            });
        }

        res.send(cases[0]);
    } catch (ex) {
        console.log(ex);

        return res.status(500).send({
            code: 500,
            message: 'Internal server error'
        });
    }
};

//route handler function
router.get('/', getAllCaseCount);
module.exports = router;