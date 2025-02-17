const connection = require('../config/db');

async function AddEmployee(employeeForm) {
	const {
		firstName,
		middleName,
		lastName,
		email,
		contactNumber,
		employeePhoto,
		dateOfBirth,
		department,
		position,
		salary,
	} = employeeForm;

	const insertQuery = `INSERT INTO employee(first_name, middle_name, last_name, email, contact_no, employee_photo, birthday, department, position, salary)
							 VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

	try {
		await connection.query(insertQuery, [
			firstName,
			middleName,
			lastName,
			email,
			contactNumber,
			employeePhoto,
			dateOfBirth,
			department,
			position,
			salary,
		]);
	} catch (error) {
		console.error(`Error inserting employee: ${error.message}`);
		throw new Error(`Error inserting employee: ${error.message}`);
	}
}

async function fetchEmployees() {
	const fetchQuery = `SELECT * FROM employee ORDER BY last_name ASC;`;
	try {
		const result = await connection.query(fetchQuery);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch employees.');
	}
}

async function fetchEmployeeDetails(id) {
	const fetchDetails = `SELECT 
				id,
				first_name || ' ' || middle_name || ' ' || last_name AS full_name,
				email,
				contact_no,
				employee_photo,
				birthday,
				department,
				position, 
				created_at,
				salary
				FROM employee WHERE id = $1;`;

	const fetchPayroll = `SELECT id, total_hours, total_overtime, total_salary, payroll_date, status FROM payroll WHERE emp_id = $1`;
	const fetchAttendance = `SELECT id, time_in, time_out, total_hours, overtime, status, created_at FROM attendance  WHERE emp_id = $1`;

	try {
		const [details, payroll, attendance] = await Promise.all([
			await connection.query(fetchDetails, [id]),
			await connection.query(fetchPayroll, [id]),
			await connection.query(fetchAttendance, [id]),
		]);

		return {
			empDetails: details.rows[0],
			payroll: payroll.rows,
			attendance: attendance.rows,
		};
	} catch (error) {
		throw new Error('Failed to fetch employee details.');
	}
}

async function fetchEmployeeList(id) {
	const fetchQuery = `SELECT id, first_name, middle_name, last_name FROM employee;`;
	try {
		const result = await connection.query(fetchQuery, [id]);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch employee list.');
	}
}

async function terminateEmployee(id) {
	const deleteQuery = `DELETE FROM employee WHERE id = $1`;
	try {
		const result = await connection.query(deleteQuery, [id]);

		if (result.rowCount > 0) {
			return { success: true, message: 'Employee terminated successfully.' };
		} else {
			return { success: false, message: 'No employee found with the given ID.' };
		}
	} catch (error) {
		console.error('Error deleting employee:', error);
		throw new Error('Failed to terminate employee.');
	}
}

module.exports = {
	AddEmployee,
	fetchEmployees,
	fetchEmployeeDetails,
	fetchEmployeeList,
	terminateEmployee,
};
