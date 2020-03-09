const userTransformer = require ('../transformers/user');
const userForm = require('../forms/user');
const dbModel = require('../models');
const ApiError = require('../class/ApiError');
const mailer = require('../lib/mailer');
const template = require('../lib/template');
const config = require('../config');

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.create = async(req, res, next) => {
  try {
    const form = await userForm(null, req.body, req.user, {
      method: 'POST',
    });

    if(form.isSuccess()) {
      const user = await form.flush(dbModel.users);
      const body = await template.twigToHtml(
        'email.subscribe.html.twig',
        {
          email: user.email,
          link: `${config.api_url}/api/authentication/confirm?token=${user.token}`
        }
      );
      await mailer.send(user.email, 'Welcome on dTorrent', body);
      res.status(200).send(userTransformer.transform(user, req.user));
    } else {
      res.status(422).send(form.getErrors());
    }

  } catch(error) {
    if(error.name === 'SequelizeUniqueConstraintError') {
      next(new ApiError(409, 'This user already exists', error));
    }
    else if(error.name === 'SequelizeValidationError') {
      next(new ApiError(409, error.message, error));
    }
    else {
      next(new ApiError(422, error.message, error));
    }
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
module.exports.getOne = async(req, res, next) => {
  try {
    console.log(req.user);
    const user = await dbModel.users.findOne({
      where : {
        id: req.params.id,
        is_validated: true,
      }
    });

    if(!user) {
      throw new ApiError(404, 'This user does not exists');
    }

    res.send(userTransformer.transform(user, req.user));
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
module.exports.getAll = async(req, res, next) => {
  try {
    const users = await dbModel.users.findAll({
      where : {
        is_validated: true,
      }
    });

    res.send(userTransformer.transform(users, req.user));
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
module.exports.update = async(req, res, next) => {
  try {
    const user = await dbModel.users.findOne({
      where : {
        id: req.params.id,
        is_validated: true,
      }
    });

    if(!user) {
      throw new ApiError(404, 'This user does not exists');
    }

    if(req.user.id !== req.params.id) {
      throw new ApiError(403, 'You have not permission');
    }

    const form = await userForm(user.dataValues, req.body, req.user, {
      method: 'PATCH'
    });

    if(form.isSuccess()) {
      const user = await form.flush(dbModel.users);
      res.status(200).send(userTransformer.transform(user, req.user));
    } else {
      res.status(422).send(form.getErrors());
    }

    res.send(userTransformer.transform(user));
  } catch(error) {
    if(error.name === 'SequelizeUniqueConstraintError') {
      next(new ApiError(409, 'This user already exists'));
    } else if(error.name === 'SequelizeValidationError') {
      next(new ApiError(409, error.message));
    } else {
      if(error.name === 'ApiError') {
        next(error);
      } else {
        next(new ApiError(422, error.message));
      }
    }
  }
};

/**
 * @param req
 * @param res
 * @param next
 * @return {Promise.<void>}
 */
module.exports.delete = async(req, res, next) => {
  try {
    throw new ApiError(403, 'You have not permission');

    const user = await dbModel.users.findOne({where: {id: req.params.id}});
    if(!user) {
      throw new ApiError(404, 'This user does not exists');
    }

    await user.destroy();
    res
      .status(200)
      .send({
      message: 'success'
    });
  } catch(e) {
    next(e);
  }
};