const express = require("express");
const multer = require("multer");
const resultsController = require("../controllers/resultsController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("file"), resultsController.importData);
router.get("/search/:sbd", resultsController.findResultBySBD);
router.get("/report", resultsController.reportResults);
router.get("/top-10-A", resultsController.topGradeAStudents);

module.exports = router;
