"use strict";
const {
  Model,
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class LoginSession extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }
  LoginSession.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accessToken: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "LoginSession",
      tableName: "LoginSessions",
      timestamps: true,
      indexes: [
        {
          fields: ["userId"],
        },
        {
          fields: ["deviceId"],
        },
      ],
    });
  return LoginSession;
};
