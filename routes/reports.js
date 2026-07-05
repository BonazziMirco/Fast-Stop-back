var express = require('express');
var router = express.Router();
const reportsController = require('../controllers/reports_controller');

router.get('/daily', reportsController.getDailyStatsByLot);
router.get('/weekly', reportsController.getWeeklyStatsByLot);
router.get('/monthly', reportsController.getMonthlyStatsByLot);

module.exports = router;
