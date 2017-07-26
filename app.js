'use strict';
require('dotenv').config();
const Koa = require('koa');
const app = new Koa();
const body = require('koa-body');
const logger = require('koa-logger');
const cors = require('kcors');
const router = require('./router');

app
  .use(logger())
  .use(cors({origin: 'localhost'}))
  .use(router.routes())
  .use(router.allowedMethods);

if (!module.parent) app.listen(process.env.SERVER_PORT || 3000);
