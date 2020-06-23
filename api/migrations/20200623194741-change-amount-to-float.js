'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Transactions', 'amount', {
      type: Sequelize.FLOAT,
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Transactions', 'amount', {
      type: Sequelize.INTEGER,
      allowNull: true
    })
  }
};
