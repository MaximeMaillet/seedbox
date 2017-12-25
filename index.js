require('dotenv').config();
'use strict';

const dtorrent = require('dtorrent');
const express = require('express');
const auth = require('2max-express-authenticate');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');

const app = express();

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
	util.ignore([
	]);
	util.secure([
		'/'
	], {
		'redirect': '/login'
	});
	util.override({
		'login': (req, res) => {
			res.redirect('/');
		},
		'logout': (req, res) => {
			res.redirect('/login');
		},
		'signup': (req, res) => {
			res.redirect('/');
		}
	});

	enableDtorrent(app);

	const prefix = '';
	nunjucks.configure(`${__dirname}/src/html`, {
		autoescape: true,
		express: app,
	});

	app.use(`${prefix}/static`, express.static(`${__dirname}/public`));
	app.use(`${prefix}/uib`, express.static(`${__dirname}/node_modules/angular-ui-bootstrap`));
	app.get('/login', (req, res) => {
		res.render('login.html', { title: 'Hey', message: 'Hello there!' });
	});
	app.get('/', (req, res) => {
		res.render('index.html', { title: 'Hey', user: req.session.user });
	});
}

main(app);

app.listen(process.env.APP_PORT);

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
	// dtorrent.start();
}