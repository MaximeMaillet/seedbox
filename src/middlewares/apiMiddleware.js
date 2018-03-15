require('dotenv').config();
const _cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const _session = require('express-session');
const FileStore = require('session-file-store')(_session);
const fileStore = new FileStore({
  path: './sessions'
});
const _multer = require('multer');

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
  cookie: {
    maxAge: 60*60*24*30*1000,
    path: '/',
    httpOnly: false,
  }
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
  multer
};