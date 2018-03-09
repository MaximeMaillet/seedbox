require('dotenv').config();
const {uid} = require('rand-token');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const {users: UserModel, tokens: TokenModel} = require('../models');

const userTransformer = require('../transformers/user');
const userForm = require('../forms/user');
const passwordForm = require('../forms/password');
const mailer = require('../lib/mailer');
const template = require('../lib/template');

const session = require('express-session');
const sessionStore = require('../middlewares/apiMiddleware').fileStore;

module.exports = {
  logout,
  login,
  subscribe,
  forgot,
  passwordPost,
  passwordGet,
  confirm,
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
  return res.send({});
}

/**
 * Log user
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function login(req, res) {
  try {
    const {email, password} = req.body;
    return UserModel
      .findOne({ where: { email, is_validated: true } })
      .then((user) => {
        if (!user || !user.validPassword(password)) {
          return res.status(401).send('Authenticate failed');
        } else {
          req.session.user = user.dataValues;
          delete user.dataValues['password'];
          return res.status(200).send(userTransformer.transform(user.dataValues, user.dataValues));
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
    const form = await userForm(null, req.body, req.session.user, {
      method: 'POST',
    });

    if(form.isSuccess()) {
      const user = await form.flush(UserModel);
      const body = await template.twigToHtml('email.subscribe.html.twig', {
        email: user.email,
        link: `${process.env.BASE_API}/authenticate/confirm?token=${user.token}`
      });
      mailer.send(user.email, 'Welcome on dTorrent', body);

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

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function confirm(req, res) {
  if(!req.query.token) {
    return res.status(401).send();
  }

  const user = await UserModel.findOne({ where: { token: req.query.token, is_validated: false } });

  if(!user) {
    return res.status(401).send();
  }

  user.is_validated = true;
  await user.save();

  const body = await template.twigToHtml('subscribe.confirm.html.twig', {
    email: user.email,
    link: `${process.env.BASE_URL}`
  });

  res.send(body);
}

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function forgot(req, res) {
  try {
    const {email} = req.body;
    const user = await UserModel.findOne({ where: { email, is_validated: true } });

    if (!user) {
      return res.status(404).send({
        message: 'This email does not exists',
      });
    } else {

      const token = await TokenModel.create({
        token: uid(32),
        type: 1,
        userId: user.id,
      });

      const body = await template.twigToHtml('email.forgotten.html.twig', {
        email: user.email,
        link: `${process.env.BASE_API}/authenticate/password/${token.token}`
      });
      await mailer.send(email, 'dTorrent - password forgotten', body);
      return res.status(200).send();
    }
  } catch(e) {
    return res.status(404).send({message: e.message});
  }
}

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function passwordGet(req, res) {
  return res.redirect(`${process.env.BASE_URL}/authenticate/password/${req.params.token}`);
}

/**
 * When user register a new password with token
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function passwordPost(req, res) {
  try {
    const {token, password, password2} = req.body;

    if(!password || password !== password2) {
      return res.status(409).send({
        message: 'Password are not same'
      });
    }

    const userToken = await TokenModel.findOne({
      where: {
        token,
        date_expired: {
          [Op.gt]: new Date(),
        }
      }
    });

    if(!userToken) {
      return res.status(409).send({
        message: 'This token has expired',
      });
    }

    const user = await UserModel.findOne({where: {id: userToken.dataValues.userId}});
    const form = await passwordForm(user, req.body, user, {
      method: 'PATCH'
    });

    if(form.isSuccess()) {
      const user = await form.flush(UserModel);
      userToken.destroy();
      res.status(200).send(userTransformer.transform(user));
    } else {
      res.status(422).send(form.errors());
    }
  } catch(e) {
    res.status(500).send(e);
  }
}

