'use strict';
require('dotenv').config();
const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize')();

let Torrent = null;

module.exports = () => {
	Torrent = sequelize.define('torrents', {
			hash: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			downloaded: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false
			},
			uploaded: {
				type: Sequelize.BIGINT,
				defaultValue: 0,
				allowNull: false
			},
			size: {
				type: Sequelize.BIGINT,
				allowNull: false
			},
			ratio: {
				type: Sequelize.DECIMAL,
				allowNull: false,
				defaultValue: 0.0,
			}
		});
	return module.exports;
};

module.exports.model = () => {
	return Torrent;
};