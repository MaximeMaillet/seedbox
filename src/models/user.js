'use strict';
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync();

module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define('users', {
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false
			},
			roles: {
				type: DataTypes.BLOB,
				allowNull: false
			},
			token: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			is_validated: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: 0,
			},
			space: {
				type: DataTypes.BIGINT,
				allowNull: false,
				defaultValue: 10*1024*1024*1024,
			}
		},
		{
			hooks: {
				beforeCreate: (user) => {
					user.password = bcrypt.hashSync(user.password, salt);
				},
				beforeUpdate: (user) => {
					if(user.changed('password')) {
						user.password = bcrypt.hashSync(user.password, salt);
					}
				},
				beforeBulkUpdate: (user) => {
					if(user.fields.indexOf('password') !== -1) {
						user.attributes.password = bcrypt.hashSync(user.attributes.password, salt);
					}
				}
			}
		});

	users.associate = (models) => {
		models.users.hasMany(models.torrents, {
			onDelete: 'CASCADE',
		});

    models.users.hasMany(models.tokens, {
      onDelete: 'CASCADE',
      foreignKey: {
        allowNull: false,
      }
    });
	};

	users.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password);
	};

	return users;
};
