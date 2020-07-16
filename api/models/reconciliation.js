'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reconciliation = sequelize.define('Reconciliation', {
    balance: DataTypes.FLOAT,
    completed: DataTypes.DATEONLY
  }, {});
  Reconciliation.associate = function(models) {
    Reconciliation.belongsTo(models.Account)
  };
  return Reconciliation;
};
