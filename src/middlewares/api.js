require('dotenv').config();
const _multer = require('multer');
const _jwt = require('express-jwt');
const config = require('../config');
const ApiError = require('../class/ApiError');
const dbModel = require('../models');

const jwt = _jwt({
  secret: config.authentication.jwt_secret,
  credentialsRequired: true,
  getToken: (req) => {
    if(req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }})
  .unless({
    path: [
      '/api/authentication/login',
      '/api/authentication/confirm',
      '/api/authentication/forgot',
      '/api/authentication/password',
      '/api/users'
  ]
});

/**
 * @param req
 * @param res
 * @param next
 */
async function rewriteSession(req, res, next) {
  try {
    if(req.user && req.user.user) {
      const user = await dbModel.users.findOne({where: {id: req.user.user.id}});
      if(!user) {
        throw new ApiError(404, 'This user does not exists');
      }

      req.user = user;
    }

    next();
  } catch(e) {
    next(e);
  }
}

const upload = _multer({dest: './public/uploads/'});
const multer = upload.fields([
  { name: 'torrents'},
  { name: 'files'}
]);

module.exports = {
  rewriteSession,
  multer,
  jwt,
};
