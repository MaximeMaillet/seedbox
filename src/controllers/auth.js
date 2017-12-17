
const User = require('../model/user');
const cookieParser = require('cookie-parser');
const session = require('express-session');

module.exports = (app) => {
	app.use(cookieParser());
	app.use(session({
		key: 'user_sid',
		secret: 'somerandonstuffs',
		resave: false,
		saveUninitialized: false,
		cookie: {
			expires: 600000
		}
	}));

	app.use((req, res, next) => {
		if (req.cookies.user_sid && !req.session.user) {
			res.clearCookie('user_sid');
		}
		next();
	});

	/**
	 * Sign Up
	 */
	app.post('/signup', (req, res) => {
		User.create({
			username: req.body.username,
			password: req.body.password
		})
			.then(user => {
				req.session.user = user.dataValues;
				res.send('ok');
			})
			.catch(error => {
				if(error.name === 'SequelizeUniqueConstraintError') {
					res.send('This user name already exists');
				} else {
					res.send(error);
				}
			});
	});

	/**
	 * Sign In
	 */
	app.post('/login', (req, res) => {
		const {username, password} = req.body;

		User.findOne({ where: { username: username } }).then((user) => {
			if (!user) {
				res.status(401).send('Authenticate failed');
			} else if (!user.validPassword(password)) {
				res.status(401).send('Authenticate failed');
			} else {
				req.session.user = user.dataValues;
				res.send('ok');
			}
		});
	});

	/**
	 * Log Out
	 */
	app.get('/logout', (req, res) => {
		if (req.session.user && req.cookies.user_sid) {
			res.clearCookie('user_sid');
			res.redirect('/');
		} else {
			res.redirect('/login');
		}
	});
};