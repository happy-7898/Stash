const sendSuccess = (res, data = null, message = "Success", statusCode = 200) => {
  return res.status(statusCode).json({
    statusCode,
    isSuccess: true,
    message,
    data,
  });
};

const sendError = (res, message = "Error", statusCode = 500, data = null) => {
  return res.status(statusCode).json({
    statusCode,
    isSuccess: false,
    message,
    data,
  });
};

module.exports = {
  sendSuccess,
  sendError,
};
