const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

module.exports.model = (persistence, model, hooks) => {
	const sequelize = new Sequelize(persistence.database, persistence.user, persistence.password, {
		host: persistence.host,
		dialect: persistence.dialect,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		operatorsAliases: false
	});

	for(const i in hooks) {
		sequelize.addHook(hooks[i].name, hooks[i].function);
	}

	const User = sequelize.define('users', {
			username: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false
			},
			roles: {
				type: Sequelize.BLOB,
				allowNull: false
			},
			token: {
				type: Sequelize.STRING,
					unique: true,
					allowNull: false
			},
			is_validated: {
				type: Sequelize.BOOLEAN,
					allowNull: false,
					defaultValue: 0,
			},
			space: {
				type: Sequelize.INTEGER,
					allowNull: false,
					defaultValue: 10*1024*1024,
			}
		},
		{
		hooks: {
			beforeCreate: (user) => {
				const salt = bcrypt.genSaltSync();
				user.password = bcrypt.hashSync(user.password, salt);
			}
		}
	});

	User.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password);
	};

	return sequelize.sync()
	.then(() => {
		return User;
	});
};