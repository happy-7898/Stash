const { User } = require("../models/index");
const { sendError, sendSuccess } = require("../utils/responseHandler.util");

const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password", "isRegistered", "createdAt", "updatedAt"] },
    });

    if (!user) {
      return sendError(res, "User not found", 404);
    }

    const response = {
      id: user.id,
      name: user.username,
    };

    return sendSuccess(res, response, "User profile fetched successfully");
  } catch (error) {
    console.error("GetMe error:", error);
    sendError(res, "Internal server error", 500);
  }
};

// const getUserById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findByPk(id, {
//       attributes: { exclude: ["password", "isRegistered", "createdAt", "updatedAt"] },
//     });

//     if (!user) {
//       return sendError(res, "User not found", 404);
//     }

//     return sendSuccess(res, user, "User details fetched successfully");
//   } catch (error) {
//     console.error("getUserById error:", error);
//     sendError(res, "Internal server error", 500);
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { name, bio, phone } = req.body;

//     let profilePicture;

//     if (req.file && req.file.path) {
//       profilePicture = req.file.path;
//     }

//     const [count] = await User.update(
//       {
//         name,
//         bio,
//         phone,
//         ...(profilePicture && { profilePicture }),
//       },
//       { where: { id: userId } },
//     );

//     if (count === 0) {
//       return sendError(res, "User not found", 404);
//     }

//     const updatedUser = await User.findByPk(userId, {
//       attributes: {
//         exclude: ["password", "isRegistered", "createdAt", "updatedAt"],
//       },
//     });

//     return sendSuccess(res, updatedUser, "User profile updated successfully");
//   } catch (error) {
//     console.error("UpdateUser error:", error);
//     return sendError(res, "Internal server error", 500);
//   }
// };

module.exports = {
  getMe,
//   getUserById,
//   updateUser,
};
