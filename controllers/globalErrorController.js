const { MulterError } = require("multer");
const AppError = require("../utils/appError");

const mongoErrorMessage = (errorMessage) => {
  const duplicateKeyPattern =
    /E11000 duplicate key error collection: .* index: .* dup key: { (.*) }/;
  const match = errorMessage.match(duplicateKeyPattern);

  if (match) {
    const duplicateKey = match[1];
    return `Lỗi: Sinh viên có ${duplicateKey} đã tồn tại!.`;
  }

  return "Lỗi không xác định từ cơ sở dữ liệu.";
};

const globalErrorHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    err.statusCode = err.statusCode || 500;
    if (err.message.includes("MongoServerError")) {
      err.message = mongoErrorMessage(err.message);
    }
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else if (err instanceof MulterError) {
    res.status(500).json({
      status: 500,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 500,
      message: "Đã xảy ra lỗi không xác định.",
    });
  }
};

module.exports = globalErrorHandler;
