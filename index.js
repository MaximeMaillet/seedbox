'use strict';

const dtorrent = require('dtorrent');
const express = require('express');
const auth = require('2max-express-authenticate');

const app = express();

/**
 * Allow Cros origin
 */
app.use((req, res, next) => {
	const allowedOrigins = ['http://localhost:3000', 'http://localhost:3737'];
	const {origin} = req.headers;
	if(allowedOrigins.indexOf(origin) > -1){
		res.setHeader('Access-Control-Allow-Origin', origin);
	}
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

main(app);

app.listen(process.env.API_PORT);

/**
 * Enable dTorrent
 * @param app
 */
function enableDtorrent(app) {
	/**
	 * Enable api
	 */
	dtorrent.enableExpressApi(app);

	/**
	 * Enable listener
	 */
	dtorrent.start();
}

async function main(app) {
	const util = await auth(app, {
		'persistence': {
			'host': process.env.MYSQL_HOST,
			'user': process.env.MYSQL_USER,
			'password': process.env.MYSQL_PASSWORD,
			'database': process.env.MYSQL_DATABASE,
			'dialect': 'mysql'
		}
	});
	util.secure([
		'/auth'
	]);

	enableDtorrent(app);
}