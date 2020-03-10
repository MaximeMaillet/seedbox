'use strict';
module.exports = (sequelize, DataTypes) => {
	const torrents = sequelize.define('torrents', {
			hash: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false
			},
			user_id: DataTypes.INTEGER,
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
      },
      server: {
        type: DataTypes.STRING,
        allowNull: false
      },
      active: {
        type: DataTypes.BOOLEAN,
      }
		});

	torrents.associate = (models) => {
		models.torrents.hasMany(models.files, {
			onDelete: 'CASCADE',
			foreignKey: {
				name: 'torrent_id',
				allowNull: false,
			}
		});

		torrents.belongsTo(models.users, {
      onDelete: 'CASCADE',
			foreignKey: 'user_id',
    });
	};

	return torrents;
};