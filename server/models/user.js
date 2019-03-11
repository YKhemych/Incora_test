'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        isAlpha: true
      }
    },
    lastName: {
      type: DataTypes.STRING,
      validate:{
        isAlpha: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate:{
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      validate:{
        isNumeric: true
      }
    },
    password: {
      type: DataTypes.STRING
    }
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};