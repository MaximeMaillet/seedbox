const {users: userModel} = require('../models');
const userTransformer = require ('../transformers/user');
const userService = require('../services/user');
const userForm = require('../forms/user');

module.exports = {
  getUsers,
  getUser,
  patchUser,
  deleteUser,
};

/**
 * @param req
 * @param res
 * @return {Promise.<ServerResponse>}
 */
async function getUsers(req, res) {
  try {
    const users = await userModel.findAll({where : {is_validated: true}});
    return res.send(userTransformer.transform(users, req.session.user));
  } catch(e) {
    res.status(500).send(e);
  }
}

/**
 * @param req
 * @param res
 * @return {Promise.<ServerResponse>}
 */
async function getUser(req, res) {
  try {
    const user = await userModel.find({where : {is_validated: true, id: req.params.id}});
    if(!user) {
      return res.status(404).send({
        message: 'This user does not exists',
      });
    }

    return res.send(userTransformer.transform(user, req.session.user));
  } catch(e) {
    res.status(500).send(e);
  }
}

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
async function patchUser(req, res) {
  try {
    if(!userService.isGranted(req.session.user, 'admin') && req.session.user.id !== req.params.id) {
      return res.status(401).send();
    }

    const user = await userModel.findOne({where: {is_validated: true, id: req.params.id}});
    if(!user) {
      return res.status(404).send({
        message: 'This user does not exists'
      });
    }

    const form = await userForm(user.dataValues, req.body, req.session.user, {
      method: 'PATCH'
    });

    if(form.isSuccess()) {
      const user = await form.flush(userModel);
      req.session.user = user;
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
async function deleteUser(req, res) {
  try {
    if(!userService.isGranted(req.session.user, 'admin')) {
      return res.status(401).send();
    }

    const user = await userModel.findOne({where: {id: req.params.id}});
    if(!user) {
      return res.status(404).send({
        message: 'This user does not exists'
      });
    }

    user.destroy();
    res.send();
  } catch(e) {
    res.status(500).send();
  }
}