const { User, Otp, LoginSession } = require("../models/index");
const generateOTP = require("../utils/generateOtp.util");
const { sendOTP } = require("../services/sendOtp.service");
const { sendError, sendSuccess } = require("../utils/responseHandler.util");
const { hashData, compareData } = require("../utils/bcrypt.util");
const { generateAccessToken, generateRefreshToken } = require("../utils/token.util");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return sendError(res, "Name, password and email are required", 500);
    }

    let user = await User.findOne({ where: { email } });

    if (user && user.isRegistered) {
      return sendError(res, "User is already registered. Please login.", 400);
    }

    const hashedPassword = await hashData(password);

    if (!user) {
      user = await User.create({ username: name, email, password: hashedPassword });
    } else {
      user.password = hashedPassword;
      await user.save();
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // expires in 5 min
    const hashedOtp = await hashData(otpCode);

    await Otp.upsert({
      userId: user.id,
      otp: hashedOtp,
      expiresAt,
    });

    await sendOTP(email, otpCode);

    return sendSuccess(res, { userId: user.id }, "OTP sent successfully");
  } catch (error) {
    console.error("Signup error:", error);
    sendError(res, "Internal server error", 500);
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const deviceId = req.headers["x-device-id"];
    const { origin } = req.query;

    if (!userId || !otp || !deviceId) {
      return sendError(res, "User ID, OTP, and deviceId are required", 400);
    }

    const otpRecord = await Otp.findOne({ where: { userId } });

    if (!otpRecord) {
      return sendError(res, "Invalid user", 400);
    }

    if (otpRecord.expiresAt < new Date()) {
      return sendError(res, "OTP has expired. Please request again.", 400);
    }

    const isValidOtp = await compareData(otp, otpRecord.otp);

    if (!isValidOtp) {
      return sendError(res, "Invalid OTP", 400);
    }

    const user = await User.findByPk(userId);

    if (origin === "registration" && user.isRegistered) {
      return sendError(res, "User is already registered. Please login.", 400);
    }

    if (origin === "registration") {
      user.isRegistered = true;
      await user.save();
    }

    await Otp.destroy({ where: { userId } });

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const existingSession = await LoginSession.findOne({
      where: {
        userId: user.id,
        deviceId,
      },
    });

    if (existingSession) {
      existingSession.accessToken = accessToken;
      existingSession.refreshToken = refreshToken;
      await existingSession.save();
    } else {
      await LoginSession.create({
        userId: user.id,
        deviceId,
        accessToken,
        refreshToken,
      });
    }

    return sendSuccess(res, { accessToken, refreshToken }, "OTP verified successfully.");
  } catch (error) {
    console.error("Verify OTP error:", error);
    sendError(res, "Internal server error", 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const deviceId = req.headers["x-device-id"];

    if (!email || !password || !deviceId) {
      return sendError(res, "Email, password, and deviceId are required", 400);
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isRegistered) {
      return sendError(res, "User not found", 404);
    }
    const isPasswordValid = await compareData(password, user.password);

    if (!isPasswordValid) {
      return sendError(res, "Invalid credentials", 401);
    }

    const payload = { id: user.id, email: user.email };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const existingSession = await LoginSession.findOne({
      where: {
        userId: user.id,
        deviceId,
      },
    });

    if (existingSession) {
      existingSession.accessToken = accessToken;
      existingSession.refreshToken = refreshToken;
      await existingSession.save();
    } else {
      await LoginSession.create({
        userId: user.id,
        deviceId,
        accessToken,
        refreshToken,
      });
    }

    return sendSuccess(res, { accessToken, refreshToken }, "Login successful");
  } catch (error) {
    console.error("Login error:", error);
    sendError(res, "Internal server error", 500);
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return sendError(res, "Email is required", 400);
    }

    const user = await User.findOne({ where: { email } });

    if (!user || !user.isRegistered) {
      return sendError(res, "User not found", 404);
    }

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    const hashedOtp = await hashData(otpCode);

    await Otp.upsert({
      userId: user.id,
      otp: hashedOtp,
      expiresAt,
    });

    await sendOTP(email, otpCode);

    return sendSuccess(res, { userId: user.id }, "Password reset OTP sent successfully");
  } catch (error) {
    console.error("ForgotPassword error:", error);
    sendError(res, "Internal server error", 500);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password: newPassword } = req.body;
    const { id: userId } = req.user;

    if (!userId || !newPassword) {
      return sendError(res, "User ID and new password are required", 400);
    }

    const user = await User.findByPk(userId);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const hashedPassword = await hashData(newPassword);

    user.password = hashedPassword;
    await user.save();

    return sendSuccess(res, null, "Password reset successful");
  } catch (error) {
    console.error("ResetPassword error:", error);
    sendError(res, "Internal server error", 500);
  }
};

const refreshAccessToken = async (req, res) => {
  try {
    const deviceId = req.headers["x-device-id"];

    if (!deviceId) {
      return sendError(res, "deviceId is required", 400);
    }
    const payload = { id: req.user.id, email: req.user.email };

    const accessToken = generateAccessToken(payload);

    await LoginSession.update(
      { accessToken },
      { where: { userId: req.user.id, deviceId } },
    );

    return sendSuccess(res, { accessToken }, "New access token generated");
  } catch (error) {
    console.error("Refresh token error:", error);
    return sendError(res, "Internal server error", 500);
  }
};

const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const deviceId = req.headers["x-device-id"];
    const user = await User.findByPk(userId);

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    if (deviceId) {
      await LoginSession.destroy({
        where: { userId, deviceId },
      });
    }

    return sendSuccess(res, null, "Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
    return sendError(res, "Server error");
  }
};

module.exports = {
  signup,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  logout,
};
