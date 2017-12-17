require('dotenv').config();
const debug = require('debug');
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const lDebug = debug('dTorrent:api:model:debug');

// create a sequelize instance with our local postgres database information.
const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
	host: process.env.MYSQL_HOST,
	dialect: 'mysql',

	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

	// http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
	operatorsAliases: false
});
// setup User model and its fields.
const User = sequelize.define('users', {
	username: {
		type: Sequelize.STRING,
		unique: true,
		allowNull: false
	},
	password: {
		type: Sequelize.STRING,
		allowNull: false
	}
}, {
	hooks: {
		beforeCreate: (user) => {
			const salt = bcrypt.genSaltSync();
			user.password = bcrypt.hashSync(user.password, salt);
		}
	}
});

User.prototype.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
	// return password === this.password;
};

// create all the defined tables in the specified database.
sequelize.sync()
	.then(() => lDebug('users table has been successfully created, if one doesn\'t exist'))
	.catch(error => lDebug('This error occured', error));

// export User model for use in other files.
module.exports = User;