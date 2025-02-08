const { verifyToken } = require('../config/auth');
const departmentModel = require('../model/department-model');

const DepartmentChoices = async (req, res) => {
	try {
		const departments = await departmentModel.fetchDepartmentList();
		res.json(departments);
	} catch (error) {
		console.error('Error adding department:', error);
		res.status(500).json({ message: 'Error adding department', error: error.message });
	}
};

const AddDepartment = async (req, res) => {
	try {
		const departmentForm = req.body;
		await departmentModel.addDepartment(departmentForm);
		res.status(200).json({ message: 'New department added.' });
	} catch (error) {
		console.error('Error adding department:', error);
		res.status(500).json({ message: 'Error adding department', error: error.message });
	}
};

const Departments = async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const departments = await departmentModel.fetchDepartments();
		res.json(departments);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching employee' });
	}
};

module.exports = { DepartmentChoices, AddDepartment, Departments };
