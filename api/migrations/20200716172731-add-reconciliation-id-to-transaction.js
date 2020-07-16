'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Transactions', 'ReconciliationId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'Reconciliations',
        key: 'id'
      },
      defaultValue: null,
      allowNull: true
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Reconciliations', 'ReconciliationId')
  }
};
