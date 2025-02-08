const { verifyToken } = require('../config/auth');
const employeeModel = require('../model/employee-model');

const AddEmployee = async (req, res) => {
	try {
		const employeeForm = req.body;
		await employeeModel.AddEmployee(employeeForm);
		res.status(200).json({ message: 'New employee added.' });
	} catch (error) {
		console.error('Error adding employee:', error);
		res.status(500).json({ message: 'Error adding employee', error: error.message });
	}
};

const EmployeeList = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const employeeList = await employeeModel.fetchEmployees();
		res.json(employeeList);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching employee' });
	}
};

const EmployeeDetails = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	const { id } = req.params;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const employeeDetails = await employeeModel.fetchEmployeeDetails(id);
		res.json(employeeDetails);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching employee details' });
	}
};

const EmployeeChoices = async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);

		const employeeList = await employeeModel.fetchEmployeeList();
		res.json(employeeList);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching employee list' });
	}
};

module.exports = { AddEmployee, EmployeeList, EmployeeDetails, EmployeeChoices };
