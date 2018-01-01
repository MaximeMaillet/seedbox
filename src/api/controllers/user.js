'use strict';

const {uid} = require('rand-token');

const RoleModel = require('../../models/role');
const UserModel = require('../../models/user');
const userTransformer = require('../../transformers/user');
const userService = require('../../services/user');

const session = require('express-session');
const sessionStore = require('../../lib/session');

/**
 * Log out user
 * @param req
 * @param res
 * @return {Promise.<*>}
 */
module.exports.logout = async(req, res) => {
	sessionStore(session).clear((d,r) => {});
	req.session = null;
	return res.redirect('/login');
};

/**
 * Log user
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.login = async(req, res) => {
	try {
		const {username, password} = req.body;
		return UserModel
			.model()
			.findOne({ where: { username: username, is_validated: true } })
			.then((user) => {
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
};

/**
 * Create user
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.post = async(req, res) => {
	if (!req.session.user || !userService.isGranted(req.session.user, 'admin')) {
		return res.status(403).send();
	}

	try {
		const user = await UserModel
			.model()
			.create({
				username: req.body.username,
				password: req.body.password,
				space: req.body.space * (1024*1024*1024),
				roles: RoleModel.getMask('user'),
				token: uid(32),
			});

		await user.save();
		res.status(200).send({message: 'User created'});

	} catch(error) {
		if(error.name === 'SequelizeUniqueConstraintError') {
			res.status(409).send({error: 'This user already exists'});
		} else {
			res.status(500).send({error: error.name});
		}
	}
};

/**
 * Get one user
 * @return {Promise.<void>}
 * @param req
 * @param res
 */
module.exports.get = async(req, res) => {
	const {id} = req.body;
	return UserModel
		.model()
		.findOne({ where: { id } })
		.then((user) => {
			if (!user) {
				throw new Error('User not exists');
			} else {
				res.send(user.dataValues);
			}
		});
};

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.delete = async(req, res) => {
	try {
		const user = await UserModel.model().findOne({raw: true, where: { id: req.params.user }});
		if(user === null) {
			return res.status(404).send({message: 'User does not exists'});
		}

		if(req.session.user.id !== user.id && !userService.isGranted(req.session.user, 'admin')) {
			return res.status(403).send();
		}

		await UserModel.model().destroy({
			force: true,
			where: { id: req.params.user }
		});
		return res.send({success: true});
	} catch(e) {
		return res.status(500).send({error: e.message});
	}
};

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.patch = async(req, res) => {
	try {
		const user = await UserModel.model().findOne({raw: true, where: { id: req.params.user }});
		if(user === null) {
			return res.status(404).send({message: 'User does not exists'});
		}

		if(req.session.user.id !== user.id || !userService.isGranted(req.session.user, 'admin')) {
			return res.status(403);
		}

		user.username = req.body.username;
		if(req.body.password) {
			user.password = req.body.password;
		}

		if(userService.isGranted(req.session.user, 'admin')) {
			user.roles = req.body.roles;
			user.space = req.body.space;
		}

		await user.save({fields: ['username', 'password', 'roles', 'space']});
		return res.send({success: true});
	} catch(e) {
		return res.status(500).send({error: e.message});
	}
};

/**
 * @param req
 * @param res
 * @return {Promise.<void>}
 */
module.exports.getAll = async(req, res) => {

	let where = {is_validated: true};
	if(userService.isGranted(req.session.user, 'admin')) {
		where = {};
	}

	return UserModel
		.model()
		.findAll({
			raw: true,
			where
		})
		.then((user) => {
			if (!user) {
				throw new Error('User not exists');
			} else {
				res.send(userTransformer.transform(user, req.session.user));
			}
		});
};