'use strict';
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize')();
const user = require('./user')();

let UserTorrent = null;

module.exports = () => {
	UserTorrent = sequelize.define(
		'user_torrent',
		{
			hash: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false
			},
			ratio: {
				type: Sequelize.DECIMAL,
				allowNull: false,
				default: 0,
			}
		});

	UserTorrent.belongsTo(user.model());

	return module.exports;
};

module.exports.model = () => {
	return UserTorrent;
};

module.exports.sync = () => {
	return sequelize.sync();
};