const projects = require('express').Router();
const axios = require('axios');
const _ = require('lodash');
let projectsCache = null;

projects.get('/', function (req, res) {

  axios.get('/projects').then(function (response) {
    projectsCache = response.data;
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

projects.get('/:projectKey/repositories', function (req, res) {
  let url = '/projects/' + req.params.projectKey + '/repos';
  axios.get(url).then(function (response) {
    projectsCache = response.data;
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



module.exports = projects;
