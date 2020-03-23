const express = require("express");
const router = express.Router();
const dailyReportModel = require("./../models/cases"),
    allTypes = { "confirmed": 'Confirmed', "deaths": 'Deaths', "recovered": 'Recovered' };


async function getCountryCount(req, res) {
    let type = (req.params.type).toLowerCase();
    let cases = [];

    if (!(type in allTypes)) {
        return res.status(400).send({
            code: 400,
            message: `Case type ${req.params.type} not supported.`
        });
    }

    cases = await dailyReportModel.dailyReportModel.aggregate([

        {
            $group: {
                _id: "$Country",
                count: { $sum: `$${allTypes[type]}` }
            }
        },
        { $sort: { count: -1 } },
        { $project: { "country": "$_id", count: 1, _id: 0 } }

    ]);
    res.send(cases);

}



//route handler function
router.get('/:type', getCountryCount);


module.exports = router;