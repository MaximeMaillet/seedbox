'use strict';
module.exports = (sequelize, DataTypes) => {
	const torrents = sequelize.define('torrents', {
			hash: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false
			},
      path: {
        type: DataTypes.STRING,
        allowNull: false
      },
			uploaded: {
				type: DataTypes.BIGINT,
				allowNull: false
			},
			downloaded: {
				type: DataTypes.BIGINT,
				allowNull: false
			},
      total: {
        type: DataTypes.BIGINT,
        allowNull: false,
      }
		});

	torrents.associate = (models) => {
		models.torrents.hasMany(models.files, {
			onDelete: 'CASCADE',
		});

		torrents.belongsTo(models.users, {
      onDelete: 'CASCADE',
    });
	};

	return torrents;
};