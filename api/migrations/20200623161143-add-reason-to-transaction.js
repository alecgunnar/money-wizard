'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Transactions', 'reason', {
      type: Sequelize.STRING,
      defaultValue: 'Unknown',
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Transactions', 'reason')
  }
};
