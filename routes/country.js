const express = require("express"),
    router = express.Router(),
    dailyReportModel = require("../models/dailyreport"),
    allTypes = { "confirmed": 'Confirmed', "deaths": 'Deaths', "recovered": 'Recovered' };


async function getCountryCount(req, res) {
    try {
        let type = (req.params.type).toLowerCase(),
            cases = [];

        if (!(type in allTypes)) {
            return res.status(400).send({
                code: 400,
                message: `Case type '${req.params.type}' is not supported.`
            });
        }

        cases = await dailyReportModel.dailyReport.aggregate([
            {
                $group: {
                    _id: "$Country",
                    count: { $sum: `$${allTypes[type]}` }
                }
            },
            { $project: { "country": "$_id", count: 1, _id: 0 } },
            { $sort: { count: -1 } }
        ]);

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
router.get('/:type', getCountryCount);
module.exports = router;