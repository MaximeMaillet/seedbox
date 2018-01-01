'use strict';
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize')();

let Role = null;

module.exports = () => {
	Role = sequelize.define('roles', {
		name: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false
		},
		mask: {
			type: Sequelize.BLOB,
			allowNull: false
		}
	});
	return module.exports;
};

module.exports.mask = async(name) => {
	const result = Role.findOne({where: {name: name}});
	if(!result) {
		throw new Error('Result not found');
	} else {
		return result.dataValues;
	}
};

module.exports.getMask = (name) => {
	const masks = {
		user: 1 << 1,
		admin: 1 << 2,
		moderator: 1 << 3
	};
	return masks[name];
};

module.exports.model = () => {
	return Role;
};

module.exports.sync = () => {
	return sequelize.sync()
	.then(() => {
		const roles = [
			{name: 'user', mask: 1 << 1},
			{name: 'moderator', mask: 1 << 2},
			{name: 'admin', mask: 1 << 3},
		];

		const promises = roles.map((role) => {
			return Role.findOrCreate({where: {name: role.name}, defaults: {name: role.name, mask: role.mask}});
		});

		return Promise.all(promises);
	});
};