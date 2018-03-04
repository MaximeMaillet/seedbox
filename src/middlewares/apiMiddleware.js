const bodyParser = require('body-parser');
const _session = require('express-session');
const FileStore = require('session-file-store')(_session);
const fileStore = new FileStore({
  path: './sessions'
});

const bodyParserJson = bodyParser.json();
const bodyParserUrlencoded = bodyParser.urlencoded({
  limit: '500mb',
  extended: true,
  parameterLimit: 1000000
});

const session = _session({
  store: fileStore,
  secret: 'dT0rr3n7',
  resave: true,
  saveUninitialized: false,
  cookie: {
    maxAge: 60*60*24*30*1000
  }
});

module.exports = {
  bodyParserJson,
  bodyParserUrlencoded,
  session,
  fileStore
};