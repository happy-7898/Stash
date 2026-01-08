"use strict";
const {
  Model,
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    static associate(models) {
      this.belongsTo(models.Category, {
        foreignKey: "categoryId",
        as: "category",
      });

      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  Item.init(
    {
      itemId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      itemName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      itemUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      itemRating: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      itemStatus: {
        type: DataTypes.ENUM("not_started", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "not_started",
      },
      categoryId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      lastUpdated: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Item",
      tableName: "Items",
      timestamps: true,
    },
  );
  return Item;
};
