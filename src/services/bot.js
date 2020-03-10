const dbModel = require('../models');
const {USER_ROLES} = require('../class/Roles');

module.exports.get = () => {
  return dbModel.users.findOne({where: dbModel.Sequelize.literal(`roles & ${USER_ROLES.BOT} != 0`)})
};