"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.Otp, {
        foreignKey: "userId",
        as: "otp",
        onDelete: "CASCADE",
      });

      this.hasMany(models.LoginSession, {
        foreignKey: "userId",
        as: "sessions",
      });

      this.hasMany(models.Category, {
        foreignKey: "userId",
        as: "categories",
        onDelete: "CASCADE",
      });

      this.hasMany(models.Item, {
        foreignKey: "userId",
        as: "items",
        onDelete: "CASCADE",
      });
    }
  }

  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isRegistered: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    },
  );

  return User;
};
