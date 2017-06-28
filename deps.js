'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const compareVersions = require('compare-versions');
const express = require('express');
var app = express();
var exec = require('child_process').exec;
// var bower = require('bower');

app.set('view engine', 'pug')

const supportedFileTypes = [
  {
    name: 'Bower',
    fileName: 'bower.json',
    dependencyTypeKeys: ['dependencies', 'devDependencies']
  },
  {
    name: 'NPM',
    fileName: 'package.json',
    dependencyTypeKeys: ['dependencies', 'devDependencies']
  }
];

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

let getDependenciesForProject = (projectName) => {
  let file = null;
  let allDependencies = {};

  _.each(supportedFileTypes, fileType => {
    try {
      file = require(path.join(__dirname, '../' + projectName, fileType.fileName));
    }
    catch (e){}

    if (file) {
      _.each(fileType.dependencyTypeKeys, dependencyObjectKey => {
        if (file[dependencyObjectKey]) {
          let packageKeys = _.keys(file[dependencyObjectKey]);
          allDependencies[fileType.name] = {
            projectName: projectName,
            dependencies: _.map(packageKeys, packageNameKey => {
              return {
                name: packageNameKey,
                version: file[dependencyObjectKey][packageNameKey],
                sourceType: isBranch(file[dependencyObjectKey][packageNameKey]) ? 'branch' : 'version',
                dependencyHost: fileType.name
              };
            })
          }
        }
      });
    }
  });

  return allDependencies;
}

let repos = getDirectories(path.join(__dirname, '../'));

// todo make this configurable
repos = _.reject(repos, directory => {
  // ignore from the main ignore list or anything with an -api prefix for now
  return (ignore.indexOf(directory) >= 0 || directory.indexOf('-api') >= 0);
});

let projects = _(repos).map(getDependenciesForProject).filter(_.identifier).value();

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

    aggregatedValues[dep.name].push({
      version: version,
      repoName: dep.name,
      projectName: project.project,
      sourceType: sourceType,
      dependencyHost: dep.dependencyHost
    });

    aggregatedValues[dep.name] = _.uniq(aggregatedValues[dep.name]);

  });

});

// let aggregatedKeys = _.keys(aggregatedValues);

let mostRecentVersions = {
  bower: {},
  npm: {}
};

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
  console.log(projects)
  console.log('listening');
});
