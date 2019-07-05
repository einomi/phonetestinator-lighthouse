const express = require('express');
const PWMetrics = require('pwmetrics');
const bodyParser = require('body-parser');

const app = express();
const port = 8888;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/api/metrics/', (req, res) => {
  const url = req.query.url;

  const pwMetrics = new PWMetrics(url, {
    flags: {
      runs: 1, // number or runs
      chromeFlags: '--headless', // run in headless Chrome
    },
  });

  pwMetrics.start().then(data => {
    res.json(data);
  });
});

app.listen(port, () => console.log(`pwmetrics app listening on port ${port}!`));
