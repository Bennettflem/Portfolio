const express = require('express');
const routes = express.Router();

const frontendRouter = require('./frontend/FrontendRoutes');
routes.use(frontendRouter);

const apiRouter = require('./api/APIRoutes');
routes.use( '/api', apiRouter);

module.exports = routes;