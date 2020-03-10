'use strict';
module.exports = (sequelize, DataTypes) => {
	const files = sequelize.define('files', {
		name: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: false
		},
		torrent_id: DataTypes.INTEGER,
		path: {
			type: DataTypes.STRING,
			allowNull: false
		},
    length: {
      type: DataTypes.INTEGER,
    },
	});

  files.associate = (models) => {
    files.belongsTo(models.torrents, {
      onDelete: 'CASCADE',
			foreignKey: 'torrent_id',
    });
  };

	return files;
};