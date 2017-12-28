const Sequelize = require('sequelize');
let Role = null;

module.exports.mask = (name) => {
	return Role.findOne({where: {name: name}})
	.then((result) => {
		if(!result) {
			throw new Error('No result found');
		}
		return result.dataValues.mask;
	});
};

module.exports.model = (persistence) => {
	const sequelize = new Sequelize(persistence.database, persistence.user, persistence.password, {
		host: persistence.host,
		dialect: persistence.dialect,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000
		},
		operatorsAliases: false,
	});

	Role = sequelize.define('roles', {
		name: {
			type: Sequelize.STRING,
			unique: true,
			allowNull: false
		},
		mask: {
			type: Sequelize.BLOB,
			allowNull: false
		}
	});

	return sequelize.sync()
	.then(() => {
		const roles = [
			{name: 'user', mask: 1 << 1},
			{name: 'moderator', mask: 1 << 2},
			{name: 'admin', mask: 1 << 3},
		];

		const promises = roles.map((role) => {
			return Role.findOrCreate({where: {name: role.name}, defaults: {name: role.name, mask: role.mask}});
		});

		return Promise.all(promises);
	})
	.then(() => {
		return Role;
	});
};