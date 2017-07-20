'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const compareVersions = require('compare-versions');
const express = require('express');
const app = express();
const cors = require('cors')
const exec = require('child_process').exec;
const axios = require('axios');
// var bower = require('bower');
const utils = require('./utils.js');
const config = require('./config.js');
const local = require('./local.js');
const stash = require('./stash.js');

// let projects = _(repos).map(getDependenciesForProject).filter(_.identifier).value();

// // aggregate values
// _.each(projects, project => {
//
//   _.each(project.dependencies, dep => {
//
//     let version = '';
//     let sourceType = '';
//
//     if (!aggregatedValues[dep.name]){
//       aggregatedValues[dep.name] = [];
//     }
//
//     if (isBranch(dep.version)) {
//       let urlEnd = dep.version.indexOf('#');
//       version = dep.version.slice(urlEnd, dep.version.length);
//       dep.version = version;
//       sourceType = 'branch';
//     }
//
//     else {
//       version = dep.version;
//       sourceType = 'normal';
//     }
//
//     aggregatedValues[dep.name].push({
//       version: version,
//       repoName: dep.name,
//       projectName: project.project,
//       sourceType: sourceType,
//       dependencyHost: dep.dependencyHost
//     });
//
//     aggregatedValues[dep.name] = _.uniq(aggregatedValues[dep.name]);
//
//   });
//
// });
//
// let mostRecentVersions = {
//   bower: {},
//   npm: {}
// };
//
// json = { aggregations: aggregatedValues, projects: projects };

console.log(stash)

app.use(cors());

// app.get('/', function (req, res) {
//   res.render('index', json)
// });

app.get('/projects', function (req, res) {
  res.json(projects);
});

app.get('/projects/:name/', function (req, res) {
  res.json(projects);
});

app.get('/repos', function (req, res) {
  res.json(projects);
});


// app.get('/repos/:name/', function (req, res) {
//   let repoToGet = _.find(projects, ['project', req.params.name ]);
//   res.render('repo', { projects: _.flatten(projects), repo: repoToGet, aggregations: aggregatedValues });
// });
//
// app.get('/dependency/:name/', function (req, res) {
//   res.render('dependency', { projects: projects, repos: aggregatedValues[req.params.name], dependency: req.params.name, mostRecentVersions, mostRecentVersions });
// });

var staticPath = path.join(__dirname, '/views');

app.use(express.static(staticPath));

app.listen(3000, function() {
  // console.log(_.flatten(projects))
  console.log('listening on 3000');
});
