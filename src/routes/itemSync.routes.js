const express = require("express");
const router = express.Router();
const { syncStashItems, getItems, deleteItems } = require("../controllers/itemSync.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/batch", authenticate, syncStashItems);
router.get("/batch", authenticate, getItems);
router.delete("/batch", authenticate, deleteItems);

module.exports = router;
