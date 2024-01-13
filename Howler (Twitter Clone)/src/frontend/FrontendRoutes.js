const express = require('express');
const frontendRouter = express.Router();

const path = require( 'path' );

const html_dir = path.resolve( __dirname + '../../../templates/' );

frontendRouter.get('/', (req, res) => {
  res.sendFile(`${html_dir}/login.html`);
});

frontendRouter.get('/profile', (req, res) => {
  res.sendFile(`${html_dir}/profile.html`);
});

frontendRouter.get('/main', (req, res) => {
  res.sendFile(`${html_dir}/main.html`);
});

module.exports = frontendRouter;