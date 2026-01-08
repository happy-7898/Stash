const express = require("express");
const { authenticate } = require("../middlewares/auth.middleware");
const { getMe } = require("../controllers/user.controller");
const { logout } = require("../controllers/auth.controller");
const router = express.Router();

router.get("/me", authenticate, getMe);
router.post("/logout", authenticate, logout);

module.exports = router;
