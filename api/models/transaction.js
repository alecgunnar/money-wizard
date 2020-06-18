'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    amount: DataTypes.INTEGER,
    type: DataTypes.ENUM('debit', 'credit'),
    date: DataTypes.DATEONLY,
    notes: DataTypes.STRING
  }, {});
  Transaction.associate = function(models) {
    Transaction.belongsTo(models.Account)
  };
  return Transaction;
};