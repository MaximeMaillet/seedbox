const moment = require('moment');

module.exports = (sequelize, DataTypes) => {
  const tokens = sequelize.define('tokens', {
    token: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date_expired: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: moment().add(1, 'days').format('YYYY-MM-DD HH:mm:ss')
    },
    user_id: DataTypes.INTEGER
  });

  tokens.associate = (models) => {
    tokens.belongsTo(models.users, {
      onDelete: 'CASCADE',
      foreignKey: 'user_id',
    });
  };

  return tokens;
};