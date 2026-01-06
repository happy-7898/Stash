"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Otp extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
        onDelete: "CASCADE",
      });
    }
  }

  Otp.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      otp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expiresAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Otp",
      tableName: "Otps",
      timestamps: true,
    },
  );

  return Otp;
};
