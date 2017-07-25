const routes = require('express').Router();
const projects = require('./projects');

routes.use('/projects', projects);

routes.get('/', (req, res) => {
  res.status(200).json({});
});

module.exports = routes;
