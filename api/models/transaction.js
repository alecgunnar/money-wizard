'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: DataTypes.INTEGER,
    type: DataTypes.ENUM('debit', 'credit'),
    date: DataTypes.DATEONLY,
    reason: DataTypes.STRING,
    notes: DataTypes.STRING
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.Account)
    Transaction.belongsTo(models.Reconciliation)
  };
  return Transaction;
};
