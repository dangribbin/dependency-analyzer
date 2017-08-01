const repositories = require('express').Router();
const axios = require('axios');
const _ = require('lodash');
let repositoriesCache = null;

repositories.get('/', function (req, res) {
  if (!repositoriesCache) {
    axios.get('/repos').then(function (response) {
      repositoriesCache = response.data;
      res.status(200).json(repositoriesCache);
    }).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
    });
  }
  else {
    res.status(200).json(repositoriesCache);
  }
});

//
// repositories.get('/:repositoryID', function (req, res) {
//   if (!repositoriesCache) {
//     axios.get('/projects').then(function (response) {
//       repositoriesCache = response.data;
//       res.status(200).json(repositoriesCache);
//     }).catch(function (error) {
//       if (error.response) {
//         // The request was made and the server responded with a status code
//         // that falls out of the range of 2xx
//         console.log(error.response.data);
//         console.log(error.response.status);
//         console.log(error.response.headers);
//       } else if (error.request) {
//         // The request was made but no response was received
//         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//         // http.ClientRequest in node.js
//         console.log(error.request);
//       } else {
//         // Something happened in setting up the request that triggered an Error
//         console.log('Error', error.message);
//       }
//     });
//   }
//   else {
//     res.status(200).json(repositoriesCache);
//   }
// });

// repositories.get('/:name', function (req, res) {
//   res.status(200).send({});
// });

module.exports = repositories;
