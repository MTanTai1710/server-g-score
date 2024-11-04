const csvParser = require("csv-parser");
const { Readable } = require("stream");
const Result = require("../models/result"); // Adjust the path if necessary
const AppError = require("../utils/appError"); // Adjust the path if necessary

class ResultsService {
  async parseCSV(file) {
    const results = [];

    const stream = Readable.from(file.toString());

    return new Promise((resolve, reject) => {
      stream
        .pipe(csvParser())
        .on("data", (data) => results.push(data))
        .on("end", () => resolve(results))
        .on("error", (error) => reject(error));
    });
  }

  async saveResults(results) {
    await Result.insertMany(results);
  }

  async saveResult(result) {
    await Result.create(result);
  }

  async findResultOfStudent(sbd) {
    const result = await Result.findOne({ sbd: sbd });
    return result;
  }

  async reportResults() {
    const subjects = [
      "toan",
      "ngu_van",
      "ngoai_ngu",
      "vat_li",
      "hoa_hoc",
      "sinh_hoc",
      "lich_su",
      "dia_li",
      "gdcd",
    ];

    const results = {};

    for (const subject of subjects) {
      results[subject] = {
        Gioi: await Result.countDocuments({ [subject]: { $gte: 8 } }),
        Kha: await Result.countDocuments({ [subject]: { $lt: 8, $gte: 6 } }),
        TrungBinh: await Result.countDocuments({
          [subject]: { $lt: 6, $gte: 4 },
        }),
        Yeu: await Result.countDocuments({ [subject]: { $lt: 4 } }),
      };
    }

    return results;
  }

  async getTopAStudents() {
    const topStudents = await Result.aggregate([
      {
        $project: {
          sbd: 1,
          toan: 1,
          vat_li: 1,
          hoa_hoc: 1,
          totalScore: {
            $add: [
              { $ifNull: ["$toan", 0] },
              { $ifNull: ["$vat_li", 0] },
              { $ifNull: ["$hoa_hoc", 0] },
            ],
          },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
      {
        $limit: 10,
      },
    ]);

    const resultWithTotalScore = topStudents.map((student) => {
      const totalScore =
        (student.toan || 0) + (student.vat_li || 0) + (student.hoa_hoc || 0);
      return {
        sbd: student.sbd,
        totalScore,
        toan: student.toan,
        vat_li: student.vat_li,
        hoa_hoc: student.hoa_hoc,
      };
    });

    return resultWithTotalScore;
  }
}

module.exports = new ResultsService();
