require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug');
const auth = require('2max-express-authenticate');

const lDebug = debug('dTorrent:api:model:debug');
let app = null;

module.exports = (_express) => {

	if(_express === null) {
		app = express();
	} else {
		app = _express;
	}

	auth(app, {
		'persistence': {
			'host': process.env.MYSQL_HOST,
			'user': process.env.MYSQL_USER,
			'password': process.env.MYSQL_PASSWORD,
			'database': process.env.DATABASE,
			'dialect': 'mysql'
		}
	});

	if(_express === null) {
		app.listen(process.env.API_PORT);
	}
};