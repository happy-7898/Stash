"use strict";
const {
  Model,
} = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      this.hasMany(models.Item, {
        foreignKey: "categoryId",
        as: "items",
        onDelete: "CASCADE",
      });
    }
  }
  Category.init(
    {
      categoryId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },

      categoryName: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      lastUpdated: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },

      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Category",
      tableName: "Categories",
      timestamps: true,
    });
  return Category;
};
