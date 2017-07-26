'use strict';
const Router = require('koa-router');
const router = new Router;

const spotifyService = require('./service-providers/spotify-service');
const duetifyService = require('./service-providers/duetify-service');

router
  .get('/login', spotifyService.login)
  .get('/refresh_token', spotifyService.refreshToken)
  .get('/', duetifyService.clientCallback);

module.exports = router;
