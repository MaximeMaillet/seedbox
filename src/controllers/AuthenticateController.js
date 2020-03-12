const jwt = require('jsonwebtoken');
const ApiError = require('../class/ApiError');
const HtmlError = require('../class/HtmlError');
const dbModel = require('../models');
const config = require('../config');
const userTransformer = require('../transformers/user');
const {uid} = require('rand-token');
const {TOKEN_TYPES} = require('../class/TokenType');
const passwordForm = require('../forms/password');
const mailer = require('../lib/mailer');
const template = require('../lib/template');

/**
 * Log user
 * @param req
 * @param res
 * @param next
 * @return {Promise.<void>}
 */
module.exports.login = async(req, res, next) => {
  try {
    const {email, password} = req.body;
    const user = await dbModel.users.findOne({
      where: {
        email,
        is_validated: true
      }
    });

    if(!user) {
      throw new ApiError(404, req.translation.get('authentication.user.not_exists'), {email: req.translation.get('authentication.user.email.not_exists')});
    }

    if(!user.validPassword(password)) {
      throw new ApiError(401, req.translation.get('authentication.fail'), {password: req.translation.get('authentication.user.password.not_validate')});
    }

    const token = jwt.sign(
      {
        user: {
          id: user.dataValues.id,
          email: user.dataValues.email,
          roles: user.dataValues.roles
        },
      },
      config.authentication.jwt_secret,
      {
        expiresIn: '1w'
      }
    );

    res.status(200).send({
      token,
      user: userTransformer.transform(user.dataValues, user.dataValues)
    });
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @return {Promise.<void>}
 */
module.exports.confirm = async(req, res, next) => {
  try {
    const {token} = req.query;

    if(!token) {
      throw new ApiError(422, 'No token provided');
    }

    const user = await dbModel.users.findOne({where: {
      token: req.query.token,
      is_validated: false
    }});

    if(!user) {
      throw new ApiError(404, 'This user does not exists');
    }

    user.is_validated = true;
    await user.save();

    res.send((await template.twigToHtml(
      'subscribe.confirm.html.twig',
      {
        link: config.base_url,
        email: user.email,
      }
    )));
  } catch(e) {
    next(e);
  }
}

/**
 * @param req
 * @param res
 * @param next
 * @return {Promise.<void>}
 */
module.exports.forgotPassword = async(req, res, next) => {
  try {
    const {email} = req.body;
    const user = await dbModel.users.findOne({where: {
      email,
        is_validated: true
    }});

    if (!user) {
      throw new ApiError(404, 'There is no user attached at this email');
    }

    const token = await dbModel.tokens.create({
      token: uid(32),
      type: TOKEN_TYPES.PASSWORD_FORGOT,
      user_id: user.id,
    });

    const body = await template.twigToHtml(
      'email.forgotten.html.twig',
      {
        email: user.email,
        link: `${config.api_url}/api/authentication/password?token=${token.token}`
      }
    );

    await mailer.send(email, 'dTorrent - password forgotten', body);
    res
      .status(200)
      .send({
        message: 'success',
      })
  } catch(e) {
    next(e);
  }
};

/**
 * When user register a new password with token
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.passwordForm = async(req, res, next) => {
  try {
    const {token: queryToken}= req.query;

    const token = await dbModel.tokens.findOne({
      where: {
        token: queryToken,
        date_expired: {
          [dbModel.Sequelize.Op.gt]: new Date(),
        }
      }
    });

    if(!token) {
      throw new HtmlError(409, 'This token has expired', (await template.twigToHtml(
        'errors.html.twig',
        {
          statusCode: 409,
          content: 'This token has expired',
        }
      )));
    }

    const user = await dbModel.users.findOne({where: {
      id: token.user_id}
    });

    if(!user) {
      throw new HtmlError(404, 'This user does not exists', (await template.twigToHtml(
        'errors.html.twig',
        {
          statusCode: 404,
          content: 'This user does not exists',
        }
      )));
    }

    res.send((await template.twigToHtml(
      'password.forgot.html.twig',
      {
        token: queryToken,
        link: `${config.api_url}/api/authentication/password`,
      }
    )));
  } catch(e) {
    next(e);
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.passwordSet = async(req, res, next) => {
  try {
    const {token: queryToken, password, password2} = req.body;

    if(!password){
      throw new HtmlError(409, 'You should define a password', (await template.twigToHtml(
        'errors.html.twig',
        {
          statusCode: 409,
          content: 'You should define a password',
          link: `${config.api_url}/api/authentication/password?token=${queryToken}`
        }
      )));
    }

    if(password !== password2) {
      throw new HtmlError(409, 'Password is not the same', (await template.twigToHtml(
        'errors.html.twig',
        {
          statusCode: 409,
          content: 'Password is not the same',
          link: `${config.api_url}/api/authentication/password?token=${queryToken}`
        }
      )));
    }

    const token = await dbModel.tokens.findOne({
      where: {
        token: queryToken,
        date_expired: {
          [dbModel.Sequelize.Op.gt]: new Date(),
        }
      }
    });

    if(!token) {
      throw new HtmlError(409, 'This token has expired', (await template.twigToHtml(
        'errors.html.twig',
        {
          statusCode: 409,
          content: 'This token has expired',
          link: `${config.api_url}/api/authentication/password?token=${queryToken}`
        }
      )));
    }

    const user = await dbModel.users.findOne({where: {
        id: token.user_id
    }});

    if(!user) {
      throw new HtmlError(404, 'This user does not exists', (await template.twigToHtml(
        'errors.html.twig',
        {
          statusCode: 409,
          content: 'This user does not exists',
          link: `${config.api_url}/api/authentication/password?token=${queryToken}`
        }
      )));
    }

    const form = await passwordForm(user, req.body, user, {
      method: 'PATCH'
    });

    if(form.isSuccess()) {
      const user = await form.flush(dbModel.users);
      await token.destroy();
      res
        .status(200)
        .send((await template.twigToHtml(
        'password.confirm.html.twig',
        {
          link: config.base_url,
          email: user.email,
        }
      )));
    } else {
      res.status(422).send(form.getErrors());
    }
  } catch(e) {
    next(e);
  }
};