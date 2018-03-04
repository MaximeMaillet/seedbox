const UserModel = require('../models').users;
const userTransformer = require('../transformers/user');
const userService = require('../services/user');
const userForm = require('../forms/user');

const session = require('express-session');
const sessionStore = require('../middlewares/apiMiddleware').fileStore;

module.exports = {
  logout,
  login,
  subscribe,
  forgot,
  password
};

/**
 * Log out user
 * @param req
 * @param res
 * @return {Promise.<*>}
 */
async function logout(req, res) {
  sessionStore(session).clear((d,r) => {});
  req.session = null;
  return res.redirect('/login');
}

/**
 * Log user
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function login(req, res) {
  try {
    const {username, password} = req.body;
    return UserModel
      .findOne({ where: { username: username, is_validated: true } })
      .then((user) => {
        console.log(user);
        if (!user || !user.validPassword(password)) {
          return res.status(401).send('Authenticate failed');
        } else {
          req.session.user = user.dataValues;
          delete user.dataValues['password'];
          return res.status(200).send(user.dataValues);
        }
      });
  } catch(e) {
    return res.status(404).send({message: e.message});
  }
}

/**
 * Create user
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function subscribe(req, res) {
  try {
    const form = await userForm(null, req.body, req.session.user);

    if(form.isSuccess()) {
      const user = await form.flush(UserModel);
      res.status(200).send(userTransformer.transform(user, req.session.user));
    } else {
      res.status(422).send(form.errors());
    }

  } catch(error) {
    if(error.name === 'SequelizeUniqueConstraintError') {
      res.status(409).send({message: 'This user already exists'});
    }
    else if(error.name === 'SequelizeValidationError') {
      res.status(409).send({message: error.message});
    }
    else {
      res.status(500).send({message: error.name});
    }
  }
}

async function forgot(req, res) {
  res.status(404).send();
}

async function password(req, res) {
  res.status(404).send();
}