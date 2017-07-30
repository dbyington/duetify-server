'use strict';
require('dotenv').config();
const qs = require('qs');

const stateKey = 'spotify_auth_state';
const scopes = 'user-read-email user-read-currently-playing user-modify-playback-state user-read-playback-state';
const redirectUri = 'http://localhost:8080/';
const spotifyAuthUrl = 'https://accounts.spotify.com/authorize?';

module.exports.login = (ctx, next) => {
  const state = getRandomString(16);
  ctx.cookies.set(stateKey, state);

  const queryString = qs.stringify({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    scope: scopes,
    redirect_uri: redirectUri,
    state: state
  });
  const spotifyAuthUri = spotifyAuthUrl + queryString;
  ctx.redirect(spotifyAuthUri);
}


/**
* Simple random alphanumeric string generator.
* @param {number} length of string, to a maximum of 36
* @return {string} The generated string
*/
const getRandomString = len => 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz'
  .split('')
  .sort(() => 0.5 - Math.random())
  .slice(0,len)
  .join('');
