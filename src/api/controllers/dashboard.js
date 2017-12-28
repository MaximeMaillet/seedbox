'use strict';

module.exports.index = async(req, res) => {
	if(!req.session || !req.session.user) {
		return res.redirect('/login');
	}

	res.render('index.html', {
		title: 'Hey',
		user: req.session.user,
	});
};

module.exports.login = async(req, res) => {
	if(req.session && req.session.user) {
		return res.redirect('/');
	}
	res.render('login.html');
};