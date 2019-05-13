require('dotenv').config();
const _multer = require('multer');
const _jwt = require('express-jwt');
const {secret} = require('../config/secret_key');
const {users: userModel} = require('../models');

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
/**
 * @param req
 * @param res
 * @param next
 */
async function rewriteSession(req, res, next) {
  if(req.user && req.user.user) {

    const user = await userModel.find({where: {id: req.user.user.id}});

    if(!user) {
      return res.status(404).send({
        message: 'This user does not exists',
      });
    }

    req.session = {
      user: user.dataValues
    };
    req.session.user.roles = new Buffer(req.session.user.roles);
  }

  next();
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
