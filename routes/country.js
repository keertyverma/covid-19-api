const express = require("express");
const router = express.Router();
const dailyReportModel = require("./../models/cases");



//route handler function
router.get('/:type', async (req, res) => {
    let type = req.params.type

    const countryCases = await dailyReportModel.dailyReportModel.find({ Country: countryFilter }).select({ Confirmed: 1, Deaths: 1, Recovered: 1 });
    //if (!countryCases) return res.status(404).send('The genre with the given ID was not found.');


    res.send(countryCases);
});


module.exports = router;