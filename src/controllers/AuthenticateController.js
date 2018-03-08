require('dotenv').config();
const UserModel = require('../models').users;
const userTransformer = require('../transformers/user');
const userForm = require('../forms/user');
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
    const form = await userForm(null, req.body, req.session.user);

    if(form.isSuccess()) {
      const user = await form.flush(UserModel);
      const body = await template.twigToHtml('email.subscribe.html.twig', {
        email: user.email,
        link: `${process.env.BASE_API}/authenticate/confirm?token=${user.token}`
      });
      mailer.send('maxime.maillet93@gmail.com', 'Welcome on dTorrent', body);
      // @TODO change email

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
    const user = await UserModel.findOne({ where: { email: email, is_validated: true } });

    if (!user) {
      return res.status(404).send();
    } else {
      const body = await template.twigToHtml('email.forgotten.html.twig', {
        email: user.email,
        link: `${process.env.BASE_API}/authenticate/password/${user.token}` // @TODO generate new token
      });
      await mailer.send(email, 'dTorrent - password forgotten', body);
      return res.status(200).send();
    }
  } catch(e) {
    return res.status(404).send({message: e.message});
  }
}

async function passwordGet(req, res) {
  res.status(404).send();
}

async function passwordPost(req, res) {
  res.status(404).send();
}