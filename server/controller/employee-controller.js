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

		console.log(employeeDetails);
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

const EmployeeTerminate = async (req, res) => {
	const token = req.cookies.token;
	const { id } = req.params;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin']);

		const result = await employeeModel.terminateEmployee(id);

		if (result.success) {
			return res.status(200).json({
				success: true,
				message: result.message || 'Employee deleted successfully.',
			});
		} else {
			return res.status(404).json({
				success: false,
				message: result.message || 'No employee found with the given ID.',
			});
		}
	} catch (error) {
		console.error('Error terminating employee:', error);
		res.status(500).json({ success: false, error: 'Error terminating employee.' });
	}
};

module.exports = { AddEmployee, EmployeeList, EmployeeDetails, EmployeeChoices, EmployeeTerminate };
