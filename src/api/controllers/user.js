'use strict';

const RoleModel = require('../../models/role');
const UserModel = require('../../models/user');
const {uid} = require('rand-token');

let persistence, User, Roles = null;
const notConnectedUrl = [/^\/signup$/, /^\/login$/, /^\/logout$/, /(.+)\.css$/, /(.+)\.css.map$/, /(.+)\.js$/];

module.exports = async(options) => {
	persistence = options.persistence;
	User = await UserModel.model(persistence);
	return module.exports;
};

/**
 * Log out user
 * @param req
 * @param res
 * @return {Promise.<*>}
 */
module.exports.logout = async(req, res) => {
	res.clearCookie('user_sid');
	req.session = null;
	return res.redirect('/login.html');
};

module.exports.login = async(req, res) => {
	try {
		const {username, password} = req.body;
		return User
			.findOne({ where: { username: username } })
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

module.exports.get = async(req, res) => {
	const {username} = req.body;
	return User
		.findOne({ where: { username: username } })
		.then((user) => {
			if (!user) {
				throw new Error('User not exists');
			} else {
				return user.dataValues;
			}
		});
};

module.exports.post = async(req, res) => {
	try {
		const user = await UserModel
			.model(persistence)
			.create({
			username: req.body.username,
			password: req.body.password,
			roles: (await RoleModel.mask('user')),
			token: uid(32),
		});
		req.session.user = user.dataValues;
		user.save();
		res.redirect('/');

	} catch(error) {
		if(error.name === 'SequelizeUniqueConstraintError') {
			res.status(409).send('This user already exists');
		} else {
			res.status(500).send(error.name);
		}
	}
};

module.exports.put = async(req, res) => {

};

module.exports.delete = async(req, res) => {

};

module.exports.getAll = async(req, res) => {

};