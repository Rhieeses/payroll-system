const { verifyToken } = require('../config/auth');
const attendanceModel = require('../model/attendance-model');

const DailyAttendance = async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const attendanceDaily = await attendanceModel.fetchAttendanceDaily();
		res.json(attendanceDaily);
	} catch (error) {
		console.error('Error fetching attendance data:', error);
		res.status(500).json({ error: 'Error fetching attendance data' });
	}
};

const WeeklyAttendance = async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		verifyToken(token, ['Admin', 'User']);
		const weekRange = req.query.weekRange;

		const attendanceWeekly = await attendanceModel.fetchAttendanceWeekly(weekRange);
		res.json(attendanceWeekly);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching Attendance weekly' });
	}
};

const UpdateAttendance = async (req, res) => {
	const token = req.cookies.token;

	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}
	try {
		verifyToken(token, ['Admin', 'User']);
		const attendanceUpdate = req.body;
		await attendanceModel.updateAttendance(attendanceUpdate);
		res.status(200).json({ message: 'Employee attendance updated.' });
	} catch (error) {
		console.error('Error adding employee:', error);
		res.status(500).json({
			message: 'Error updating employee attendance',
			error: error.message,
		});
	}
};

const AddAttendance = async (req, res) => {
	try {
		const employeeAttendanceForm = req.body;
		await attendanceModel.addAttendance(employeeAttendanceForm);
		res.status(200).json({ message: 'Employee attendance added.' });
	} catch (error) {
		console.error('Error adding employee:', error);
		res.status(500).json({ message: 'Error adding employee attendance', error: error.message });
	}
};

module.exports = { DailyAttendance, WeeklyAttendance, UpdateAttendance, AddAttendance };
