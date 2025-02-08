const express = require('express');
const router = express.Router();

const departmentController = require('../controller/department-controller');

router.get('/department-choices', departmentController.DepartmentChoices);
router.post('/add-department', departmentController.AddDepartment);
router.get('/department-list', departmentController.Departments);

module.exports = router;
