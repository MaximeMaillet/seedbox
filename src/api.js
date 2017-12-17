require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug');

const auth = require('./controllers/auth');

const lDebug = debug('dTorrent:api:model:debug');
let app = null;

module.exports = (_express) => {

	if(_express === null) {
		app = express();
	} else {
		app = _express;
	}

	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	/**
	 * Auth management
	 */
	auth(app);

	if(_express === null) {
		app.listen(process.env.API_PORT);
	}
};