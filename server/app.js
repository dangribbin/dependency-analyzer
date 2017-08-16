'use strict';

const _ = require('lodash');
const path = require('path');
const compareVersions = require('compare-versions');
const express = require('express');
const app = express();
const cors = require('cors');
const axios = require('axios');
const bower = require('bower');

function reflect (promise){
    return promise.then(function(v){ return {v:v, status: "resolved"} }, function(e){ return {e: e, status: "rejected"} } );
}

axios.defaults.baseURL = process.env.URL;

axios.defaults.auth = {
  username: process.env.USERNAME,
  password: process.env.PASSWORD
};
axios.defaults.params = {
  limit: 10000
};

app.use(cors());

function logError (error) {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.log(error.request);
  } else {
    console.log('Error', error.message);
  }
}

app.get('/projects', function (req, res) {
  axios.get('/projects').then(function (response) {
    res.status(200).json(response.data);
  }).catch(logError);
});

app.get('/projects/:projectKey/repositories', function (req, res) {

  let reposURL = '/projects/' + req.params.projectKey + '/repos';
  axios.get(reposURL).then(function (response) {

    let repos = response.data ? response.data.values : [];

    if (req.query.stats && repos) {
      let lastCommitPromises = [];
      let defaultBranchPromises = [];
      let repoToLastCommitUrlMap = {};

      // all possible repos
      _.each(repos, function (repo) {
        let defaultBranchURL = '/projects/' + req.params.projectKey + '/repos/' + repo.slug + '/branches/default';
        defaultBranchPromises.push(axios.get(defaultBranchURL))
      });

      axios.all(defaultBranchPromises.map(reflect)).then((defaultBranchResponses) => {

        // repos that have a default branch
        defaultBranchResponses = _.map(defaultBranchResponses, 'v.data');

        _.each(repos, function (repo, index) {
          if ( defaultBranchResponses[index] && !repoToLastCommitUrlMap[repo.slug] ) {
            let latestCommitURL = '/projects/' + req.params.projectKey + '/repos/' + repo.slug + '/commits/' + defaultBranchResponses[index].latestCommit;
            repoToLastCommitUrlMap[repo.slug] = latestCommitURL;
          }
        });

        let reposWithLastCommits = _.filter(repos, function (repo) {
          return repoToLastCommitUrlMap[repo.slug];
        });

        // get a list of lats commits for repos that had a default branch
        _.each(_.keys(repoToLastCommitUrlMap), function (key) {
          lastCommitPromises.push(axios.get(repoToLastCommitUrlMap[key]));
        });

        axios.all(lastCommitPromises.map(reflect)).then((lastCommitResponses)=> {
          lastCommitResponses = _.map(lastCommitResponses.filter(x => x.status === "resolved"), 'v');
          _.each(lastCommitResponses, function (commit, index) {
            reposWithLastCommits[index].lastCommit = commit.data;
          });

          let reposWithNoLastCommits = _.difference(repos, reposWithLastCommits);

          let allRepos = _.concat(reposWithLastCommits, reposWithNoLastCommits);

          res.status(200).json(allRepos);
        }).catch(function (err) {
          console.log("Error getting commits")
          logError(err);
        });


      }).catch(function (err) {
        console.log(err);
      });

    }
    else {

      res.status(200).json(repos);
    }
  }).catch(logError);
});

app.get('/projects/:projectKey/repositories/:repositorySlug/commits', function (req, res) {
  let url = '/projects/' + req.params.projectKey + '/repos/' + req.params.repositorySlug + '/commits';
  axios.get(url).then(function (response) {
    res.status(200).json(response.data);
  }).catch(logError);
});

app.post('/projects/:projectKey/repositories/:repositorySlug/stats', function (req, res) {
  let repos = req.body.repos;
  let url = '/projects/' + req.params.projectKey + '/repos/' + req.params.repositorySlug + '/commits';
  axios.get(url, { params: {limit: 1}}).then(function (response) {
    res.status(200).json(response.data);
  }).catch(logError);
});

app.get('/projects/:projectKey/repositories/:repositorySlug/dependencies', function (req, res) {
  let url = '/projects/' + req.params.projectKey + '/repos/' + req.params.repositorySlug + '/files';
  axios.get(url).then(function (response) {

    let filePromises = [];

    let fileNames = _.filter(response.data.values, (filename) => {
      return filename.indexOf('package.json') >= 0 || filename.indexOf('bower.json') >= 0;
    });

    _.each(fileNames, (filename) => {
      let filePathUrl = '/projects/' + req.params.projectKey + '/repos/' + req.params.repositorySlug + '/browse/' + filename;
      let promise = axios.get(filePathUrl);
      filePromises.push(promise)
    });

    axios.all(filePromises).then((fileresponses)=> {

      let files = _.map(fileresponses, 'data');
      let dependencyObjects = [];
      let packageInfoPromises = [];

      _.each(files, (file, index) => {
        let depsPromises = [];
        let allPackageManagerFileDependencyKeys = [];
        let text = '';

        // files come back in { lines: [...]} format from stash - convert to JSON
        _.each(file.lines, (item) => { text += item.text });
        let depFile = JSON.parse(text);
        depFile.fileName = fileNames[index]; // decorate for client

        let packageManagers = [
          {
            base: 'https://registry.npjs.org/';,
            name: 'npm',
            propsToInspect: ['dependencies', 'devDependencies'],
            currentVersions: []
          },
          {
            base: 'https://libraries.io/api/bower/',
            name: 'bower',
            propsToInspect: ['dependencies', 'devDependencies'],
            currentVersions: []
          }
        ];

        // get the most current versions of deps used in repo
        _.each(packageManagers, packageManager => {

          let dependenciesToRequestCurrentVersionsOf = _.map(packageManager.propsToInspect, prop => {
            return {
              dependencyNames: _.keys(depFile[prop]),
              packageManagerName: packageManager
            };
          });

          allPackageManagerFileDependencyKeys.push(dependenciesToRequestCurrentVersionsOf);
        });

        _.each(allPackageManagerFileDependencyKeys, key => {
          return axios.get(packageManager.base + key);
        });

        dependencyObjects.push(depFile);
      });

      axios.all(packageInfoPromises.map(reflect)).then( packageInfoResponses => {
        packageInfoResponses = _.map(packageInfoResponses, 'v.data');
        let currentVersions = {};
        // make an easily-referenced object for the client
        _.each(packageInfoResponses, packageInfo => {
          currentVersions[packageInfo.name] = packageInfo['dist-tags'] ? packageInfo['dist-tags'].latest : (packageInfo.latest_release_number ? packageInfo.latest_release_number : '');
        });
        res.status(200).json({ dependencyObjects, currentVersions});
      });

    }).catch(function (err) {
      res.status(400).json(err);
    });
  }).catch(logError);
});


app.listen(3000, function() {
  console.log('listening on 3000');
});
