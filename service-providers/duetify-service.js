'use strict';
const qs = require('qs');
const moment = require('moment');
const fetch = require('node-fetch');
const FormData = require('form-data');
const request = require('request-promise');

const stateKey = 'spotify_auth_state';
const redirectUri = 'http://localhost:8080/';
const tokenUrl = 'https://accounts.spotify.com/api/token';
const refreshUrl = 'https://accounts.spotify.com/api/token';


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
      .then(data => {
        data = JSON.parse(data);
        let newBody = {
          expires_in: data.expires_in,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
          expires: new Date(moment().add(data.expires_in, 's').format())
        };
        return newBody;
        return responseBodyObject;
        ctx.status = 200;
      })
      .catch( err => {
        console.log(`Error retrieving token: ${err}`);
      });
    const responseBodyObject = Object.assign({},bodyObject,{state: state});
    const responseBody = qs.stringify(responseBodyObject);
    ctx.redirect('http://localhost:4200/auth?' + responseBody);
  }
};

module.exports.refreshToken = async (ctx, next) => {
  let bodyObject;
  console.log('refreshToken token:',ctx.request.query.refresh_token);
  if (ctx.request.query.refresh_token) {
    const httpHeaders = {
      'Authorization': 'Basic ' + (new Buffer(process.env.CLIENT_ID + ':' + process.env.CLIENT_SECRET).toString('base64'))
    };
    const form = {
      grant_type: 'refresh_token',
      refresh_token: ctx.request.query.refresh_token
    };
    const fetchOptions =  {
      url: refreshUrl,
      method: 'POST',
      headers: httpHeaders,
      form: form,
      json: true
    };
    console.log('refreshToken fetchOptions:',fetchOptions);
    bodyObject = await request.post(fetchOptions)
    .then('data', data => {
      ctx.status = 200;
      let body = Object.assign({},data,{expires: new Date(moment().add(data.expires_in, 's').format())});
      console.log('refresh body:',body);
      ctx.body = body;
    })
    .catch( err => console.log('error refreshing token:',err));
  } else {
    ctx.status = 400;
    bodyObject = { error: {code: 400, error_message: 'Bad request'}};
  }
  ctx.body = bodyObject;
};
