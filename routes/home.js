const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome to COVID-19 stats analyser.. your last stop to get all updated informations !!!");
});

module.exports = router;
