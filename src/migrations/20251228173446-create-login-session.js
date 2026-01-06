"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LoginSessions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      deviceId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      accessToken: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addIndex("LoginSessions", ["userId"]);
    await queryInterface.addIndex("LoginSessions", ["userId", "deviceId"], {
      unique: true,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("LoginSessions");
  },
};
