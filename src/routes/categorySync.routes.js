const express = require("express");
const router = express.Router();
const { syncCategories, getCategories, deleteCategories } = require("../controllers/categorySync.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.post("/batch", authenticate, syncCategories);
router.get("/batch", authenticate, getCategories);
router.delete("/batch", authenticate, deleteCategories);

module.exports = router;
