const { sequelize, Category } = require("../models");
const { sendError, sendSuccess } = require("../utils/responseHandler.util");

const syncCategories = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { stashCategoryList } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(stashCategoryList) || stashCategoryList.length === 0) {
      await transaction.rollback();
      return sendError(res, "stashCategoryList must be a non-empty array", 400);
    }

    for (const entry of stashCategoryList) {
      const { stashCategory, lastUpdated } = entry;

      if (
        !stashCategory ||
        !stashCategory.categoryId ||
        !stashCategory.categoryName ||
        !lastUpdated
      ) {
        await transaction.rollback();
        return sendError(res, "Invalid stash category payload", 400);
      }

      const existing = await Category.findOne({
        where: {
          userId,
          categoryId: stashCategory.categoryId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!existing) {
        await Category.create(
          {
            categoryId: stashCategory.categoryId,
            categoryName: stashCategory.categoryName,
            userId,
            lastUpdated,
          },
          { transaction },
        );
      } else if (lastUpdated > existing.lastUpdated) {
        await existing.update(
          {
            categoryName: stashCategory.categoryName,
            lastUpdated,
          },
          { transaction },
        );
      }
    }

    await transaction.commit();
    return sendSuccess(res, null, "Categories synced successfully");
  } catch (error) {
    await transaction.rollback();
    console.error("Sync categories error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

const getCategories = async (req, res) => {
  try {
    const userId = req.user.id;

    const categories = await Category.findAll({
      where: { userId },
    });

    const response = categories.map((category) => ({
      stashCategory: {
        categoryId: category.categoryId,
        categoryName: category.categoryName,
      },
      lastUpdated: category.lastUpdated,
    }));

    return sendSuccess(
      res,
      { stashCategoryList: response },
      "Categories fetched successfully",
    );
  } catch (error) {
    console.error("Get categories error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

const deleteCategories = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { deleteCategoryList } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(deleteCategoryList) || deleteCategoryList.length === 0) {
      await transaction.rollback();
      return sendError(res, "deleteCategoryList must be a non-empty array", 400);
    }

    await Category.destroy({
      where: {
        categoryId: deleteCategoryList,
        userId,
      },
      transaction,
    });

    await transaction.commit();
    return sendSuccess(
      res,
      null,
      "Categories deleted successfully",
    );
  } catch (error) {
    await transaction.rollback();
    console.error("Delete categories error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

module.exports = {
  syncCategories,
  getCategories,
  deleteCategories,
};
