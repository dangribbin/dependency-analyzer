const projects = require('express').Router();
const axios = require('axios');
const _ = require('lodash');

let commitsCache = null;

if (!commitsCache) {
  projects.get('/projects/:projectID/repository/:repositoryID/commits', function (req, res) {
    let url = '/projects/' + req.params.projectID + '/' + req.params.repositoryID + '/commits';
    axios.get(url).then(function (response) {
      commitsCache = response.data;
      res.status(200).json(response.data);
    }).catch(function (error) {
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
    });
  });
}
else {

}

module.exports = projects;
