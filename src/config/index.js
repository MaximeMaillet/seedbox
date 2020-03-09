require('dotenv').config();
const globalConfig = require(`./parameters.${process.env.NODE_ENV || 'development'}.js`);

module.exports = {
  ...globalConfig,
  sequelize: require(`./sequelize.${process.env.NODE_ENV || 'development'}.js`),
};