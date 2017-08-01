const routes = require('express').Router();
const projects = require('./projects');
const repositories = require('./repositories');

routes.use('/projects', projects);
routes.use('/repositories', repositories);

routes.get('/', (req, res) => {
  res.status(200).json({});
});

module.exports = routes;
