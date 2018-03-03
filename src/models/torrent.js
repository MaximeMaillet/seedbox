'use strict';
module.exports = (sequelize, DataTypes) => {
	const torrents = sequelize.define('torrents', {
			hash: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
			uploaded: {
				type: DataTypes.BIGINT,
				allowNull: false
			},
			downloaded: {
				type: DataTypes.BIGINT,
				allowNull: false
			},
		});

	torrents.associate = (models) => {
		models.torrents.hasMany(models.files, {
			onDelete: 'CASCADE',
			foreignKey: {
				allowNull: false
			}
		});
	};

	return torrents;
};


// require('dotenv').config();
// const Sequelize = require('sequelize');
//
// const sequelize = require('../lib/sequelize')();
// const File = require('./files')();
// let Torrent = null;
//
// module.exports = () => {
// 	Torrent = sequelize.define('torrents', {
// 			hash: {
// 				type: Sequelize.STRING,
// 				unique: true,
// 				allowNull: false
// 			},
// 			name: {
// 				type: Sequelize.STRING,
// 				allowNull: false
// 			},
// 			uploaded: {
// 				type: Sequelize.BIGINT,
// 				allowNull: false
// 			},
// 			downloaded: {
// 				type: Sequelize.BIGINT,
// 				allowNull: false
// 			},
// 		});
//
// 	Torrent.hasMany(File.model(), {as: 'torrent_id'});
//
// 	return module.exports;
// };
//
// module.exports.model = () => {
// 	return Torrent;
// };
//
// module.exports.sync = () => {
// 	return sequelize.sync({alter: true});
// };