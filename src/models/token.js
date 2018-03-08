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
  });

  return tokens;
};

module.exports.TYPES = {
  PASSWORD_FORGOT: 1,
};