const { sequelize, Item } = require("../models");
const { sendError, sendSuccess } = require("../utils/responseHandler.util");

const syncStashItems = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { stashItemList } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(stashItemList) || stashItemList.length === 0) {
      await transaction.rollback();
      return sendError(res, "itemList must be a non-empty array", 400);
    }

    for (const entry of stashItemList) {
      const { stashItem, lastUpdated } = entry;

      if (
        !stashItem ||
        !stashItem.stashItemId ||
        !stashItem.stashCategoryId ||
        !stashItem.stashItemName ||
        !lastUpdated
      ) {
        await transaction.rollback();
        return sendError(res, "Invalid stash item payload", 400);
      }

      const existingItem = await Item.findOne({
        where: {
          userId,
          categoryId: stashItem.stashCategoryId,
          itemId: stashItem.stashItemId,
        },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!existingItem) {
        await Item.create({
          itemId: stashItem.stashItemId,
          itemName: stashItem.stashItemName,
          itemUrl: stashItem.stashItemUrl ?? "",
          itemRating: stashItem.stashItemRating ?? "",
          itemStatus: stashItem.stashItemCompleted,
          categoryId: stashItem.stashCategoryId,
          userId,
          lastUpdated: lastUpdated,
        });
      } else if (lastUpdated > existingItem.lastUpdated) {
        await existingItem.update(
          {
            itemName: stashItem.stashItemName,
            itemUrl: stashItem.stashItemUrl,
            itemRating: stashItem.stashItemRating,
            itemStatus: stashItem.stashItemCompleted,
            lastUpdated: lastUpdated,
          },
          {
            transaction,
          },
        );
      }
    }

    await transaction.commit();
    return sendSuccess(res, null, "Stash items synced successfully");
  } catch (error) {
    await transaction.rollback();
    console.error("Sync stash items error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

const getItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await Item.findAll({
      where: { userId },
    });

    const response = items.map((item) => ({
      stashItem: {
        stashItemId: item.itemId,
        stashCategoryId: item.categoryId,
        stashItemName: item.itemName,
        stashItemUrl: item.itemUrl,
        stashItemRating: item.itemRating,
        stashItemCompleted: item.itemStatus,
      },
      lastUpdated: item.lastUpdated,
    }));

    return sendSuccess(
      res,
      { stashItemList: response },
      "Items fetched successfully",
    );
  } catch (error) {
    console.error("Get items error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

const deleteItems = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const { deleteItemList } = req.body;
    const userId = req.user.id;

    if (!Array.isArray(deleteItemList) || deleteItemList.length === 0) {
      await transaction.rollback();
      return sendError(res, "deleteItemList must be a non-empty array", 400);
    }

    await Item.destroy({
      where: {
        itemId: deleteItemList,
        userId,
      },
      transaction,
    });

    await transaction.commit();
    return sendSuccess(
      res,
      { deleteItemList },
      "Items deleted successfully",
    );
  } catch (error) {
    await transaction.rollback();
    console.error("Delete items error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

module.exports = {
  syncStashItems,
  getItems,
  deleteItems,
};
