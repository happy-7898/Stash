const express = require("express");
const {
  signup,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logout,
} = require("../controllers/auth.controller");
const { authenticate, authenticateRefresh } = require("../middlewares/auth.middleware");
const router = express.Router();

router.post("/register", signup);
router.post("/verifyOtp", verifyOtp);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", authenticate, resetPassword);
router.post("/refresh", authenticateRefresh, refreshAccessToken);
router.post("/logout", authenticate, logout);

module.exports = router;
