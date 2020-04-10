const express = require("express"),
    router = express.Router(),
    dailyReportModel = require("../models//dailyreport"),
    allTypes = { "confirmed": 'Confirmed', "deaths": 'Deaths', "recovered": 'Recovered' };

async function getCountryCount(req, res) {
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
                _id: "$Country_Region",
                count: { $sum: `$${allTypes[type]}` }
            }
        },
        { $project: { "country": "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } }
    ]);

    res.send(cases);
};

//route handler function
router.get('/:type', getCountryCount);
module.exports = router;