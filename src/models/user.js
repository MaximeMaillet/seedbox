'use strict';
require('dotenv').config();
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../lib/sequelize')();
const salt = bcrypt.genSaltSync();
let User = null;

module.exports = () => {
	User = sequelize.define('users', {
			username: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			roles: {
				type: Sequelize.BLOB,
				allowNull: false
			},
			token: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false
			},
			is_validated: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			space: {
				type: Sequelize.BIGINT,
				allowNull: false,
				defaultValue: 10*1024*1024*1024,
			}
		},
		{
			hooks: {
				beforeCreate: (user) => {
					user.password = bcrypt.hashSync(user.password, salt);
				},
				beforeUpdate: (user) => {
					if(user.changed('password')) {
						console.log('update mother fucker');
						user.password = bcrypt.hashSync(user.password, salt);
					}
				}
			}
		});

	User.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password);
	};

	return module.exports;
};

module.exports.model = () => {
	return User;
};

module.exports.sync = () => {
	return sequelize.sync();
};