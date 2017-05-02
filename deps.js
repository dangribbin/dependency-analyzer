'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const compareVersions = require('compare-versions');
const express = require('express');
var app = express();
var exec = require('child_process').exec;

app.set('view engine', 'pug')

let aggregatedValues = {};
let json;

// ignore specific directories
// let ignore = ['dev', 'hailstone-web-client', 'moderation', 'shift-components'];
let ignore = [];

let getDirectories = (srcpath) => {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

let isBranch = version => {

  return ( version.indexOf('#') >= 0 && ((version.indexOf('www.') > 0) || (version.indexOf('https://') >= 0) || (version.indexOf('ssh://') >= 0) ) ) ;

};

let getBowerDependencies = (repoName) => {
  let bowerFile = null;
  try {
    bowerFile = require(path.join(__dirname, '../' + repoName, 'bower.json'));
  }
  catch (e){

  }
  if (!bowerFile) {
    try {
      bowerFile = require(path.join(__dirname, '../' + repoName, 'package.json'));
    }
    catch (e){

    }
  }
  if (bowerFile) {

    if (bowerFile.dependencies) {
      
      let keys = _.keys(bowerFile.dependencies);
      
      return {
        project: repoName,
        dependencies: _.map(keys, key => {
          return {
            name: key,
            version: bowerFile.dependencies[key],
            sourceType: isBranch(bowerFile.dependencies[key]) ? 'branch' : 'version'
          };
        })
      }

    }

  }

  return false;
}

let repos = getDirectories(path.join(__dirname, '../'));

// todo make this configurable
repos = _.reject(repos, directory => { 
  // ignore from the main ignore list or anything with an -api prefix for now
  return (ignore.indexOf(directory) >= 0 || directory.indexOf('-api') >= 0); 
});

let projects = _(repos).map(getBowerDependencies).filter(_.identifier).value();

// aggregate values
_.each(projects, project => {

  _.each(project.dependencies, dep => {

    let version = '';
    let sourceType = '';

    if (!aggregatedValues[dep.name]){
      aggregatedValues[dep.name] = [];
    }
    
    if (isBranch(dep.version)) {
      let urlEnd = dep.version.indexOf('#');
      version = dep.version.slice(urlEnd, dep.version.length);
      dep.version = version;
      sourceType = 'branch';
    }

    else {
      version = dep.version;
      sourceType = 'normal';
    }

    aggregatedValues[dep.name].push( {
      version: version,
      repoName: dep.name,
      projectName: project.project,
      sourceType: sourceType 
    });
    aggregatedValues[dep.name] = _.uniq(aggregatedValues[dep.name]);

  });

});

// let aggregatedKeys = _.keys(aggregatedValues);


let mostRecentVersions = {};

// _.each(aggregatedKeys, key => {
//   let string = `npm view ${key} version`;
//   let child = exec(string, (error, stdout, stderr) => {
//     mostRecentVersions[key] = stdout;
//     console.log(stdout);
//     // console.log('stdout: ' + stdout);
//     // console.log('stderr: ' + stderr);
//     // if (error !== null) {
//     //   console.log('exec error: ' + error);
//     // }
//   // });

// });
console.log(aggregatedValues)
json = { aggregations: aggregatedValues, projects: projects };


app.get('/', function (req, res) {
  res.render('index', json)
});

app.get('/repos/:name/', function (req, res) {
  let repoToGet = _.find(projects, ['project', req.params.name ]);
  res.render('repo', { projects: projects, repo: repoToGet, aggregations: aggregatedValues });
});

app.get('/dependency/:name/', function (req, res) {
  res.render('dependency', { projects: projects, repos: aggregatedValues[req.params.name], dependency: req.params.name, mostRecentVersions, mostRecentVersions });
});

var staticPath = path.join(__dirname, '/views');

app.use(express.static(staticPath));

app.listen(3000, function() {
  console.log('listening');
});
