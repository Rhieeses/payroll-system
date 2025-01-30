const express = require('express');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const connection = require('../config/db');
const jwt = require('jsonwebtoken');
const dbInsert = require('../model/INSERT/dbInsert');
const dbSelect = require('../model/SELECT/dbSelect');
const dbUpdate = require('../model/UPDATE/dbUpdate');

const multer = require('multer');
const path = require('path');

dotenv.config();
const router = express();
const JWT_SECRET = process.env.JWT_SECRET;

const { verifyToken } = require('../config/auth');
const cookieParser = require('cookie-parser');

let storagePhoto = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../../uploads'));
	},
	filename: function (req, file, cb) {
		const newFileName = 'employee-photo' + Date.now() + path.extname(file.originalname);
		cb(null, newFileName);
	},
});

const uploadPhoto = multer({
	storage: storagePhoto,
}).single('file');

router.use(cookieParser());

router.post('/upload-photo', (req, res) => {
	uploadPhoto(req, res, function (err) {
		if (err) {
			return res.status(500).json({ error: err.message });
		}
		if (!req.file) {
			return res.status(400).json({ error: 'No file uploaded' });
		}
		// If successful, send back the file details or a success message
		res.status(200).json({
			message: 'File uploaded successfully',
			fileName: req.file.filename,
			filePath: `/uploads/${req.file.filename}`,
		});
	});
});

router.post('/login', async (req, res) => {
	const { username, password } = req.body;

	try {
		// Query the database to find the user by username
		const result = await connection.query('SELECT * FROM users WHERE username = $1', [
			username,
		]);
		const user = result.rows[0];

		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const payload = {
			userId: user.id,
			username: user.username,
			name: user.name,
			position: user.position,
		};
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });

		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 5 * 60 * 60 * 1000,
			sameSite: 'strict',
		});

		res.status(200).json({ message: 'Login successful!', user: payload, token });
	} catch (error) {
		console.error('Error during login:', error);
		res.status(500).json({ message: 'Server error' });
	}
});

router.post('/add-employee', async (req, res) => {
	try {
		const employeeForm = req.body;
		await dbInsert.addEmployee(employeeForm);
		res.status(200).json({ message: 'New employee added.' });
	} catch (error) {
		console.error('Error adding employee:', error);
		res.status(500).json({ message: 'Error adding employee', error: error.message });
	}
});

router.post('/employee-attendance', async (req, res) => {
	try {
		const employeeAttendanceForm = req.body;
		await dbInsert.addEmployeeAttendance(employeeAttendanceForm);
		res.status(200).json({ message: 'Employee attendance added.' });
	} catch (error) {
		console.error('Error adding employee:', error);
		res.status(500).json({ message: 'Error adding employee attendance', error: error.message });
	}
});

router.post('/add-department', async (req, res) => {
	try {
		const departmentForm = req.body;
		await dbInsert.addDepartment(departmentForm);
		res.status(200).json({ message: 'New department added.' });
	} catch (error) {
		console.error('Error adding department:', error);
		res.status(500).json({ message: 'Error adding department', error: error.message });
	}
});

router.get('/employee-list', async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const employeeList = await dbSelect.fetchEmployees();
		res.json(employeeList);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching employee' });
	}
});

router.get('/employee-details/:id', async (req, res) => {
	const token = req.cookies.token;
	const { id } = req.params;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const employeeDetails = await dbSelect.fetchEmployeeDetails(id);
		res.json(employeeDetails);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching employee details' });
	}
});
router.get('/attendance-daily', async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const attendanceDaily = await dbSelect.fetchAttendanceDaily();
		res.json(attendanceDaily);
	} catch (error) {
		console.error('Error fetching attendance data:', error);
		res.status(500).json({ error: 'Error fetching attendance data' });
	}
});

router.get('/attendance-weekly', async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const attendanceWeekly = await dbSelect.fetchAttendanceWeekly();
		res.json(attendanceWeekly);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching Attendance weekly' });
	}
});

router.get('/department-list', async (req, res) => {
	const token = req.headers.authorization.split(' ')[1];
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const employeeList = await dbSelect.fetchDepartments();
		res.json(employeeList);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching employee' });
	}
});

//list select
router.get('/department-choices', async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const departmentList = await dbSelect.fetchDepartmentList();
		res.json(departmentList);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching Departments' });
	}
});

router.get('/employee-choices', async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const employeeList = await dbSelect.fetchEmployeeList();
		res.json(employeeList);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching employee list' });
	}
});

router.get('/payroll', async (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const payrollList = await dbSelect.fetchPayrollList();
		res.json(payrollList);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching payroll list' });
	}
});
router.patch('/attendance-edit', async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}
	try {
		verifyToken(token, ['Admin', 'User']);
		const attendanceUpdate = req.body;
		await dbUpdate.updateAttendance(attendanceUpdate);
		res.status(200).json({ message: 'Employee attendance updated.' });
	} catch (error) {
		console.error('Error adding employee:', error);
		res.status(500).json({
			message: 'Error updating employee attendance',
			error: error.message,
		});
	}
});

module.exports = router;
