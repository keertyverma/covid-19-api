const express = require("express"),
    router = express.Router(),
    dailyReportModel = require("../models/dailyreport"),
    allTypes = { "confirmed": 'Confirmed', "deaths": 'Deaths', "recovered": 'Recovered' };

async function getStateCaseCount(req, res) {
    try {
        let type = (req.params.type).toLowerCase(),
            countryFilter = req.query.country,
            cases = [],
            aggregates = [
                {
                    $group: {
                        _id: { state: "$State", country: "$Country" },
                        count: { $sum: `$${allTypes[type]}` }
                    }
                },
                { $sort: { count: -1 } },
                { $project: { "country": "$_id.country", "state": "$_id.state", "_id": 0, "count": 1 } }];

        if (!(type in allTypes)) {
            return res.status(400).send({
                code: 400,
                message: `Case type '${req.params.type}' is not supported.`
            });
        }

        if (countryFilter) {
            aggregates.unshift({ $match: { Country: countryFilter } })
        }

        cases = await dailyReportModel.dailyReport.aggregate(aggregates)

        if (cases.length == 0) {
            return res.status(404).send({
                code: 404,
                message: `No data found for given filter[s] - ${JSON.stringify(req.query).replace(/"/g, '\'')}`
            });
        }

        res.send(cases);

    } catch (ex) {
        console.log(ex);
        return res.status(500).send({
            code: 500,
            message: 'Internal server error'
        });
    }
};

//route handler function
router.get('/:type', getStateCaseCount);
module.exports = router;