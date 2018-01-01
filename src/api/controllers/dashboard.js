'use strict';

const userService = require('../../services/user');

/**
 * @param req
 * @param res
 * @return {Promise.<*>}
 */
module.exports.index = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	return res.render('index.twig', {
		version: '0.0.5',
		user: req.session.user,
	});
};

/**
 * @param req
 * @param res
 * @return {Promise.<*>}
 */
module.exports.torrents = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	res.render('torrents.twig', {
		version: '0.0.5',
		user: req.session.user
	});
};

/**
 * @param req
 * @param res
 * @return {Promise.<*>}
 */
module.exports.admin = async(req, res) => {
	if(!req.session || !req.session.user || !userService.isGranted(req.session.user, 'admin')) {
		return res.redirect('/login');
	}

	res.render('admin.twig', {
		version: '0.0.5',
		user: req.session.user
	});
};

/**
 * Log in html render
 * @param req
 * @param res
 * @return {Promise.<*>}
 */
module.exports.login = async(req, res) => {
	if(req.session && req.session.user) {
		return res.redirect('/');
	}

	res.render('login.twig', {
		version: '0.0.5'
	});
};