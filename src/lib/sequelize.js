'use strict';
const Sequelize = require('sequelize');

module.exports = () => {
	return new Sequelize(process.env.DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
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
};