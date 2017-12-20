require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const debug = require('debug');

const lDebug = debug('dTorrent:api:model:debug');
let app = null;

module.exports = (_express) => {

	if(_express === null) {
		app = express();
	} else {
		app = _express;
	}

	if(_express === null) {
		app.listen(process.env.API_PORT);
	}


};