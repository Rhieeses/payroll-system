const express = require('express');
const router = express.Router();

const employeeController = require('../controller/employee-controller');

router.post('/add-employee', employeeController.AddEmployee);
router.get('/employee-list', employeeController.EmployeeList);
router.get('/employee-details/:id', employeeController.EmployeeDetails);
router.get('/employee-choices', employeeController.EmployeeChoices);
router.delete('/terminate-employee', employeeController.EmployeeTerminate);

module.exports = router;
