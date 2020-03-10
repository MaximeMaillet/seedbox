const config = require('../config');
const bcrypt = require('bcryptjs');
const saltValue = bcrypt.genSaltSync(10);
const {uid} = require('rand-token');
const {USER_ROLES} = require('../class/Roles');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('users', [{
      email: `bot@${config.base_url.replace(/^(http|https):\/\//, '')}`,
      password: bcrypt.hashSync('9dkdk93#dkd_@dks565', saltValue),
      roles: USER_ROLES.USER | USER_ROLES.BOT,
      token: uid(32),
      is_validated: true,
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  }
};
