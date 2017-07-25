'use strict';

const _ = require('lodash');
const path = require('path');
const compareVersions = require('compare-versions');
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');

const utils = require('./helpers/utils');
const local = require('./helpers/local');
const config = require('./config');
const routes = require('./routes');

axios.defaults.baseURL = process.env.URL;
axios.defaults.auth = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};
axios.defaults.params = {
  limit: 1000
};

app.use(cors());

var staticPath = path.join(__dirname, '/views');
app.use('/', routes);
app.use(express.static(staticPath));


app.listen(3000, function() {
  console.log('listening on 3000');
});
