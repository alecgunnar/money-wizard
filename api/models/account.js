'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    name: DataTypes.STRING,
    type: DataTypes.STRING
  }, {});
  Account.associate = function(models) {
    Account.hasMany(models.Transaction)
  };
  return Account;
};