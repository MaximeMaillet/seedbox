require('dotenv').config();
'use strict';

const dtorrent = require('dtorrent');
const express = require('express');
const Twig = require('twig');
const bodyParser = require('body-parser');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');
const debug = require('debug');

const parsetorrent = require('parse-torrent');

const lDebug = debug('dTorrent:daemon:debug');
const sessionStore = require('./src/lib/session');
const upload = multer({dest: `${__dirname}/public/uploads/`});

const app = express();
const server = require('http').createServer(app);

main(app);

server.listen(process.env.APP_PORT);
console.log(`start on ${process.env.APP_PORT}`);

async function main(app) {

	try {
		// await dtorrent.fake();
		await dtorrent.start();
		const manager = await dtorrent.manager();

		manager.addListener({
			onAdded: (torrent) => {
				// console.log(torrent);
				// console.log(parsetorrent(fs.readFileSync(torrent.file_path)));
			}
		});

		// console.log(parsetorrent(fs.readFileSync('.data/dtorrent/torrent/[oxtorrent.com] Youv-Dee-2017-Gear-2.torrent')));
		// manager.addWebHook('http://localhost:8080/connard', {
		// 	onFailed: (Url, status, body, headers) => {
		// 		console.log(status);
		// 		console.log(body);
		// 		console.log(headers);
		// 	},
		// 	onError: (Url, err) => {
		// 		console.log(err);
		// 	}
		// });

		await initDatabase();
		//
		// configExpress(app);
		//
		// await enableFront(app);
		//
		// const dashboardController = require('./src/api/controllers/dashboard');
		// const userController = require('./src/api/controllers/user');
		// const websocketController = require('./src/api/controllers/web-socket')(server, manager);
		// const torrentController = require('./src/api/controllers/torrent')(manager);
		//
		// await routes(app, {
		// 	dashboardController,
		// 	userController,
		// 	websocketController,
		// 	torrentController
		// });

	} catch(e) {
		console.log(e);
	}
}

/**
 * @return {Promise.<void>}
 */
async function initDatabase() {
	lDebug('Configuration database');
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

	lDebug('Initialization models');
	const models = require('./src/lib/sequelize');
	models.sequelize.sync().then(() => {

	});
}

/**
 * Configuration for express
 * @param app
 */
function configExpress(app) {
	const cookieDate = new Date();
	cookieDate.setDate(cookieDate.getDate() + 30);
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(bodyParser.json());

	app.use(session({
		store: sessionStore(session),
		secret: 'dT0rr3n7',
		resave: true,
		saveUninitialized: false,
		cookie: {
			maxAge: 60*60*24*30*1000
		}
	}));
	app.use(bodyParser.urlencoded({
		limit: '500mb',
		extended: true,
		parameterLimit: 1000000
	}));
	app.use(bodyParser.json());
}

/**
 * Enable front
 * @param app
 * @return {Promise.<void>}
 */
async function enableFront(app) {
	app.set('views', `${__dirname}/src/front/views`);

	app.set('twig options', {
		strict_variables: false
	});

	enableTwig('./src/front/twig');

	app.use('/static', express.static(`${__dirname}/public`));
	app.use('/uib', express.static(`${__dirname}/node_modules/angular-ui-bootstrap`));
}

/**
 * Define routes of app
 * @param app
 * @param controllers
 * @return {Promise.<void>}
 */
async function routes(app, controllers) {

	const {userController, dashboardController, websocketController, torrentController} = controllers;

	// Front
	app.get('/', dashboardController.index);
	app.get(/^\/login/, dashboardController.login);
	app.get(/^\/admin$/, dashboardController.admin);
	app.get(/^\/torrents$/, dashboardController.torrents);

	// Api for user
	app.get('/api/users', userController.getAll);
	app.post('/api/users/login', userController.login);
	app.post('/api/users/logout', userController.logout);
	app.post('/api/users', userController.post);
	app.delete('/api/users/:user', userController.delete);
	app.patch('/api/users/:user', userController.patch);

	// Api for torrents
	// app.get('/api/torrents/listener', websocketController.listener);
	app.get('/api/torrents', torrentController.getAll);
	app.get('/api/torrents/:hash', torrentController.getOne);
	app.get('/api/torrents/:hash/metadata', torrentController.getOneMetadata);
	app.put('/api/torrents/:hash/pause', torrentController.pause);
	app.put('/api/torrents/:hash/resume', torrentController.resume);
	app.get('/api/torrents/:hash/download', torrentController.download);
	app.delete('/api/torrents/:hash', torrentController.delete);
	const t = upload.fields([
		{ name: 'torrents'},
		{ name: 'files'}
	]);
	app.post('/api/torrents', t, torrentController.post);
}

/**
 * Enable custom twig
 * @param twigDirectory
 */
function enableTwig(twigDirectory) {
	let fn = null;
	fs.readdir(twigDirectory, (err, files) => {
		files.forEach(file => {
			fn = require(`${twigDirectory}/${file}`);
			Twig.extendFunction(fn.name, fn.main);
		});
	});
}