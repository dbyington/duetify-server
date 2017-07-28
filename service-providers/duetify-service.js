'use strict';
const qs = require('qs');
const fetch = require('node-fetch');
const FormData = require('form-data');
const request = require('request-promise');

const stateKey = 'spotify_auth_state';
const redirectUri = 'http://localhost:8080/';
const tokenUrl = 'https://accounts.spotify.com/api/token';


module.exports.clientCallback = async (ctx, next) => {

  const code = ctx.request.query.code || false;
  const state = ctx.request.query.state || false;
  const storedState = ctx.cookies.get(stateKey);

  if (state === false || state !== storedState) {
    ctx.body = 'State error';
    ctx.status = 401;
  } else {
    ctx.cookies.set(stateKey, state, {expires: new Date(Date.now() - 10)});
    const httpHeaders = {
      'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
    };

    const form = {
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code'
    };

    const fetchOptions =  {
      url: tokenUrl,
      method: 'POST',
      headers: httpHeaders,
      form: form
    };
    let bodyObject = await request.post(fetchOptions)
      .then('data', data => {
        data = JSON.parse(data);
        return {
          expires_in: data.expires_in,
          access_token: data.access_token,
          refresh_token: data.refresh_token
        };
        // return responseBodyObject;
        // ctx.status = 200;
      })
      .catch( err => {
        console.log(`Error retrieving token: ${err}`);
      });
    const responseBodyObject = JSON.parse(bodyObject);
    responseBodyObject['state'] = state;
    const responseBody = qs.stringify(responseBodyObject);
    ctx.redirect('http://localhost:4200/auth?' + responseBody);
  }
};
