require('dotenv').config();
'use strict';

const dtorrent = require('dtorrent');
const express = require('express');
const engines = require('consolidate');
const bodyParser = require('body-parser');

const session = require('express-session');
const cookieSession = require('cookie-session');

const Sequelize = require('sequelize');
const parseTorrent = require('parse-torrent');

const app = express();

async function main(app) {

	try {

		await enableApi(app);

		await enableFront(app);

		// await enableDtorrent(app);
	} catch(e) {
		console.log(e);
	}
}

main(app);

app.listen(process.env.APP_PORT);


/**
 * Enable front
 * @param app
 * @return {Promise.<void>}
 */
async function enableFront(app) {
	app.set('views', `${__dirname}/src/front/html`);
	app.engine('html', engines.mustache);
	app.set('view engine', 'html');

	app.use('/static', express.static(`${__dirname}/public`));
	app.use('/uib', express.static(`${__dirname}/node_modules/angular-ui-bootstrap`));
}

/**
 * Enable api
 * @param app
 * @return {Promise.<void>}
 */
async function enableApi(app) {
	const userController = await require('./src/api/controllers/user')({
		'persistence': {
			'host': process.env.MYSQL_HOST,
			'user': process.env.MYSQL_USER,
			'password': process.env.MYSQL_PASSWORD,
			'database': process.env.MYSQL_DATABASE,
			'dialect': 'mysql'
		}
	});

	const dashboardController = require('./src/api/controllers/dashboard');

	const cookieDate = new Date();
	cookieDate.setDate(cookieDate.getDate() + 30);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(cookieSession({
		name: 'session',
		keys: ['dTorrentIsAGoodApiisnthe'],
		maxAge: 30 * 24 * 60 * 60 * 1000
	}));

	await routes(app, {
		dashboardController,
		userController
	});
}

/**
 * Define routes of app
 * @param app
 * @param controllers
 * @return {Promise.<void>}
 */
async function routes(app, controllers) {

	const {userController, dashboardController} = controllers;

	await dtorrent.enableExpressApi(app);
	app.post('/api/torrents', (req, res, next) => {
		if(!req.session || !req.session.user) {
			return res.redirect('/login');
		}
		next();
	});

	app.post('/api/login', userController.login);
	app.post('/api/logout', userController.logout);
	app.post('/api/signup', userController.post);
	app.get('/', dashboardController.index);
	app.get(/^\/(login|login\.html)$/, dashboardController.login);
}

/**
 * Enable dTorrent listener
 */
function enableDtorrent() {
	// dtorrent.start();
}