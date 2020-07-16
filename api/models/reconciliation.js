'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reconciliation = sequelize.define('Reconciliation', {
    balance: DataTypes.FLOAT
  }, {});
  Reconciliation.associate = function(models) {
    // associations can be defined here
  };
  return Reconciliation;
};