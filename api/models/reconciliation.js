'use strict';
module.exports = (sequelize, DataTypes) => {
  const Reconciliation = sequelize.define('Reconciliation', {
    balance: DataTypes.FLOAT,
    completed: DataTypes.DATEONLY
  }, {});
  return Reconciliation;
};
