const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const router = require("../routes/examResultsRouter");
const AppError = require("../utils/appError");
const globalErrorHandler = require("../controllers/globalErrorController"); // Ensure to require the globalErrorHandler

const app = express();

app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cors());

app.use("/api/v1/exam-results", router);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
