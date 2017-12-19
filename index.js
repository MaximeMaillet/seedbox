const dtorrent = require('dtorrent');
const api = require('./src/api');
const express = require('express');

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

dtorrent.useExpress(app);
dtorrent.start();

api(app);

app.listen(process.env.API_PORT);