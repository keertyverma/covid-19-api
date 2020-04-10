const express = require("express"),
  router = express.Router();

router.get("*", (req, res) => {
  res.send(`
  <b>Welcome to COVID-19 stats analyser.. your last stop to get all updated informations !!!</b>
  <ul>
  <li>Get your <a href="https://app.getpostman.com/run-collection/e3db374a45c3f3a7eec1">Postman collection here</a></li>

  <li><a href="https://github.com/keertyverma/covid-19-stats-api/blob/master/open-api-3-spec.yml">Open API 3 Spec file</a></li>

  <li><a href="https://github.com/keertyverma/covid-19-stats-api">Github Project</a></li>
  </ul>
  `);
});

module.exports = router;
