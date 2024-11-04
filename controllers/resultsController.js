const resultsService = require("../services/resultsService");
const AppError = require("../utils/appError");

class ResultsController {
  async importData(req, res, next) {
    try {
      const csvFile = req.file;
      if (!csvFile) {
        res.status(400).json({ message: "Tệp không được cung cấp." });
        return;
      }
      const results = await resultsService.parseCSV(csvFile.buffer);
      if (results !== null) {
        await Promise.all(
          results.map(async (result) => await resultsService.saveResult(result))
        );
      }
      res.status(200).json({
        status: 200,
        message: "Nhập dữ liệu thành công",
      });
    } catch (error) {
      next(new AppError(`Lỗi ${error}`, 500));
    }
  }

  async findResultBySBD(req, res, next) {
    try {
      let sbd = req.params.sbd;
      const result = await resultsService.findResultOfStudent(sbd);
      if (result == null) {
        return next(new AppError("Số báo danh không hợp lệ!", 400));
      }
      res.status(200).json({
        status: 200,
        data: result,
      });
    } catch (error) {
      return next(new AppError(`Lỗi: ${error}`, 500));
    }
  }

  async reportResults(req, res, next) {
    try {
      const results = await resultsService.reportResults();
      res.status(200).json({
        status: 200,
        results,
      });
    } catch (error) {
      return next(new AppError(`Lỗi: ${error}`, 500));
    }
  }

  async topGradeAStudents(req, res, next) {
    try {
      const results = await resultsService.getTopAStudents();
      res.status(200).json({
        status: 200,
        results,
      });
    } catch (error) {
      return next(new AppError(`Lỗi: ${error}`, 500));
    }
  }
}

module.exports = new ResultsController();
