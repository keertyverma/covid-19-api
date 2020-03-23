const express = require("express");
const router = express.Router();
const dailyReportModel = require("./../models/cases"),
    allTypes = { "confirmed": 'Confirmed', "deaths": 'Deaths', "recovered": 'Recovered' };

async function getStateCaseCount(req, res) {
    let type = (req.params.type).toLowerCase();
    let countryFilter = req.query.country
    let cases = [];

    if (!(type in allTypes)) {
        return res.status(400).send({
            code: 400,
            message: `Case type ${req.params.type} not supported.`
        });
    }

    if (countryFilter) {
        cases = await dailyReportModel.dailyReportModel.aggregate([
            { $match: { Country: countryFilter } },
            { $group: { _id: "$Country", confirmed: { $sum: "$Confirmed" }, deaths: { $sum: "$Deaths" }, recovered: { $sum: "$Recovered" } } }
        ]);
        if (cases.length == 0) {
            let errorMessage = {
                code: 404,
                message: `No data found for given ${countryFilter} country`
            };
            return res.status(404).send(errorMessage);
        }
        cases = await dailyReportModel.dailyReportModel.aggregate([
            { $match: { Country: countryFilter } },
            {
                $group: {
                    _id: { state: "$State", country: "$Country" },
                    count: { $sum: `$${allTypes[type]}` }
                }
            },
            { $sort: { count: -1 } },
            { $project: { "country": "$_id.country", "state": "$_id.state", "_id": 0, "count": 1 } }
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

            {
                $group: {
                    _id: { state: "$State", country: "$Country" },
                    count: { $sum: `$${allTypes[type]}` }
                }
            },
            { $sort: { count: -1 } },
            { $project: { "country": "$_id.country", "state": "$_id.state", "_id": 0, "count": 1 } }


        ]);

    }

    res.send(cases);

}
//route handler function
router.get('/:type', getStateCaseCount);


module.exports = router;