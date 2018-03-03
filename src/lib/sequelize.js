'use strict';
require('dotenv').config();
const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');

const db = {};

db.sequelize = new Sequelize(process.env.DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
	host: process.env.MYSQL_HOST,
	dialect: process.env.MYSQL_DIALECT,
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	operatorsAliases: false
});

fs
	.readdirSync(`${__dirname}/../models/`)
	.filter(file => {
		return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
	})
	.forEach(file => {
		const model = db.sequelize['import'](path.join(`${__dirname}/../models/`, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(modelName => {
	if (db[modelName].associate) {
		db[modelName].associate(db);
	}
});

db.Sequelize = Sequelize;

module.exports = db;