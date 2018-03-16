require('dotenv').config();
const _cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _multer = require('multer');
const unless = require('express-unless');
const _jwt = require('express-jwt');
const {secret} = require('../config/secret_key');
const moment = require('moment');

const _session = require('express-session');
const FileStore = require('session-file-store')(_session);
const fileStore = new FileStore({
  path: './sessions'
});

const jwt = _jwt({
  secret,
  credentialsRequired: false,
  getToken: (req) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
}).unless({ path: [
  '/api/authenticate/login',
  '/api/authenticate/subscribe',
  '/api/authenticate/forgot',
  '/api/authenticate/password',
  '/api/authenticate/password',
  '/authenticate/confirm',
  '/authenticate/password/:token',
  '/authenticate/logout',
  ]
});

const bodyParserJson = bodyParser.json();
const bodyParserUrlencoded = bodyParser.urlencoded({
  limit: '500mb',
  extended: true,
  parameterLimit: 1000000
});

const cookie = cookieParser();
const session = _session({
  store: fileStore,
  secret: 'dT0rr3n7',
  resave: true,
  saveUninitialized: true,
});


function rewriteSession(req, res, next) {
  if(req.session && req.session.user) {
    req.session.user.roles = new Buffer(req.session.user.roles);
  }
  next();
}

const whiteList = process.env.CORS_DOMAIN.split(',');
const corsOptions = {
  origin: whiteList,
  optionsSuccessStatus: 200,
  methods: ['GET', 'PATCH', 'POST'],
  credentials: true,
};

const cors = _cors(corsOptions);

const upload = _multer({dest: './public/uploads/'});
const multer = upload.fields([
  { name: 'torrents'},
  { name: 'files'}
]);

module.exports = {
  bodyParserJson,
  bodyParserUrlencoded,
  cookie,
  session,
  rewriteSession,
  cors,
  fileStore,
  multer,
  jwt,
};