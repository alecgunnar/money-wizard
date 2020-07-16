'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Reconciliations', 'completed', {
      type: Sequelize.DATEONLY,
      allowNull: false
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn('Reconciliations', 'completed', {
      type: Sequelize.DATE,
      allowNull: true
    })
  }
};
