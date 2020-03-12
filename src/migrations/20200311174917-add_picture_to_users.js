'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'users',
      'picture',
      {
        type: Sequelize.STRING(255),
        after: 'email',
        defaultValue: null,
        allowNull: true,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'users',
      'picture'
    );
  }
};
