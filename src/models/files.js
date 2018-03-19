'use strict';
module.exports = (sequelize, DataTypes) => {
	const files = sequelize.define('files', {
		name: {
			type: DataTypes.STRING,
			unique: false,
			allowNull: false
		},
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
    });
  };

	return files;
};