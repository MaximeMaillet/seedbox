const bcrypt = require('bcryptjs');
const saltValue = bcrypt.genSaltSync(10);

module.exports = (sequelize, DataTypes) => {
	const users = sequelize.define('users', {
			email: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			picture:DataTypes.STRING,
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
					user.password = bcrypt.hashSync(user.password, saltValue);
				},
				beforeUpdate: (user) => {
					if(user.changed('password')) {
						user.password = bcrypt.hashSync(user.password, saltValue);
					}
				},
				beforeBulkUpdate: (user) => {
					if(user.fields.indexOf('password') !== -1) {
						user.attributes.password = bcrypt.hashSync(user.attributes.password, saltValue);
					}
				}
			}
		}
	);

	users.associate = (models) => {
		models.users.hasMany(models.torrents, {
			onDelete: 'CASCADE',
			foreignKey: {
				name: 'user_id',
				allowNull: false,
			}
		});

    models.users.hasMany(models.tokens, {
      onDelete: 'CASCADE',
      foreignKey: {
      	name: 'user_id',
        allowNull: false,
      }
    });
	};

	users.prototype.validPassword = function(password) {
		return bcrypt.compareSync(password, this.password);
	};

	users.prototype.isOwner = function(owner) {
		return this.id === owner.id;
	};

	return users;
};
