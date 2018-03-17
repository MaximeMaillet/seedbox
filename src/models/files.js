'use strict';
module.exports = (sequelize, DataTypes) => {
	const files = sequelize.define('files', {
		name: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: false
		},
		path: {
			type: DataTypes.STRING,
			allowNull: false
		},
	});

  files.associate = (models) => {
    files.belongsTo(models.torrents, {
      onDelete: 'CASCADE',
    });
  };

	return files;
};


//
// const Sequelize = require('sequelize');
//
//
// // const sequelize = require('../lib/sequelize')();
// let File = null;

// module.exports = () => {
// 	File = sequelize.define('files', {
// 			name: {
// 				type: Sequelize.STRING,
// 				unique: false,
// 				allowNull: false
// 			},
// 			size: {
// 				type: Sequelize.BIGINT,
// 				allowNull: false
// 			},
// 			path: {
// 				type: Sequelize.STRING,
// 				allowNull: false
// 			},
// 		});
//
// 	return module.exports;
// };
//
// module.exports.model = () => {
// 	return File;
// };
//
// module.exports.sync = () => {
// 	return sequelize.sync({
// 		alter: true
// 	});
// };