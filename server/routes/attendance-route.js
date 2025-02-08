const express = require('express');
const router = express.Router();

const attendanceController = require('../controller/attendance-controller');

router.get('/daily', attendanceController.DailyAttendance);
router.get('/weekly', attendanceController.WeeklyAttendance);
router.patch('/update-attendance', attendanceController.UpdateAttendance);
router.post('/add-attendance', attendanceController.AddAttendance);

module.exports = router;
