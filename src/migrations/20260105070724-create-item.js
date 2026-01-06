"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Items", {
      itemId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      itemName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      itemUrl: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      itemRating: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      itemStatus: {
        type: Sequelize.ENUM("not_started", "in_progress", "completed"),
        allowNull: false,
        defaultValue: "not_started",
      },
      lastUpdated: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      categoryId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "Categories",
          key: "categoryId",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Items");
  },
};
