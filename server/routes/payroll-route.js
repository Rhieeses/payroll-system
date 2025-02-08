const express = require('express');
const router = express.Router();

const payrollController = require('../controller/payroll-controller.js');

router.get('/payroll-list', payrollController.PayrollList);

module.exports = router;
