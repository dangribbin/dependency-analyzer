const projects = require('express').Router();
const axios = require('axios');
const _ = require('lodash');

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

projects.get('/', function (req, res) {
  axios.get('/projects').then(function (response) {
    res.status(200).json(response.data);
  }).catch(logError);
});

projects.get('/projects/:projectKey/repositories', function (req, res) {

  let reposURL = '/projects/' + req.params.projectKey + '/repos';
  axios.get(reposURL).then(function (response) {

    let repos = response.data ? response.data.values : [];

    if (req.query.stats && repos) {
      let commitPromises = [];

      _.each(repos, function (repo) {
        let defaultBranchURL = '/projects/' + req.params.projectKey + '/repos/' + repo.slug + '/branches/default';

        axios.get(defaultBranchURL).then((defaultBranchResponse) => {
          let defaultBranchName = defaultBranchResponse.data.values;
          let commitsURL = '/projects/' + req.params.projectKey + '/repos/' + repo.slug + '/compare/commits?from=';
          commitPromises.push(axios.get(url, { params: {limit: 1}}));

          axios.all(commitPromises).then((commitResponses)=> {
            commitResponses = commitResponses.data ? commitResponses.data.values : [];
            _.each(commitResponses, function (commit, index) {
              repos[index].lastCommit = commit.data;
            });

            res.status(200).json(repos);
          }).catch(function (err) {
            logError(err);
          });

        });

      });


    }
    else {

      res.status(200).json(repos);
    }
  }).catch(logError);
});

projects.get('/projects/:projectKey/repositories/:repositorySlug/commits', function (req, res) {
  let url = '/projects/' + req.params.projectKey + '/repos/' + req.params.repositorySlug + '/commits';
  axios.get(url).then(function (response) {
    res.status(200).json(response.data);
  }).catch(logError);
});

projects.post('/projects/:projectKey/repositories/:repositorySlug/stats', function (req, res) {
  let repos = req.body.repos;
  let url = '/projects/' + req.params.projectKey + '/repos/' + req.params.repositorySlug + '/commits';
  axios.get(url, { params: {limit: 1}}).then(function (response) {
    res.status(200).json(response.data);
  }).catch(logError);
});

projects.get('/projects/:projectKey/repositories/:repositorySlug/dependencies', function (req, res) {
  let url = '/projects/' + req.params.projectKey + '/repos/' + req.params.repositorySlug + '/files';
  axios.get(url).then(function (response) {
    let fileNames = _.filter(response.data.values, (filename) => {
      return filename.indexOf('package.json') >= 0 || filename.indexOf('bower.json') >= 0;
    })
    let filePromises = [];
    _.each(fileNames, (filename) => {
      let filePathUrl = '/projects/' + req.params.projectKey + '/repos/' + req.params.repositorySlug + '/browse/' + filename;
      let promise = axios.get(filePathUrl, {raw: true});
      filePromises.push(promise)
    });
    axios.all(filePromises).then((fileresponses)=> {
      let files = _.map(fileresponses, 'data');
      res.status(200).json(files);
    }).catch(function (err) {
      res.status(400).json(err);
    });
  }).catch(logError);
});


module.exports = projects;
