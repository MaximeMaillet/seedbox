'use strict';
require('dotenv').config();

if(!process.env.MYSQL_HOST) {
	process.env.MYSQL_HOST = '127.0.0.1';
}
if(!process.env.MYSQL_USER) {
	process.env.MYSQL_USER = 'dtorrent';
}
if(!process.env.MYSQL_PASSWORD) {
	process.env.MYSQL_PASSWORD = 'dtorrent';
}
if(!process.env.DATABASE) {
	process.env.DATABASE = 'dtorrent';
}
if(!process.env.MYSQL_DIALECT) {
	process.env.MYSQL_DIALECT = 'mysql';
}

const models = require('../src/lib/sequelize');
models.sequelize.sync().then(() => {
	console.log('Database synced');
});