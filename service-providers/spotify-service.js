'use strict';

module.exports.login = (ctx, next) => {
  ctx.body = 'app and user login to Spotify here';
  return next();
}

module.exports.refreshToken = (ctx, next) => {
  ctx.body = 'Pass refresh_token to Spotify to get a new token and refresh_token here';
  return next();
}
