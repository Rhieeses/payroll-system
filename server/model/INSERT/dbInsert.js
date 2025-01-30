const connection = require('../../config/db');

async function addEmployee(employeeForm) {
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
async function addEmployeeAttendance(employeeAttendanceForm) {
	const { rowId, timeInUTC, timeOutUTC, statusRow } = employeeAttendanceForm;

	const insertQuery = `INSERT INTO attendance(emp_id, time_in, time_out, status) VALUES($1, $2, $3, $4)`;

	try {
		await connection.query(insertQuery, [rowId, timeInUTC, timeOutUTC, statusRow]);
	} catch (error) {
		console.error(`Error inserting employee attendance: ${error.message}`);
		throw new Error(`Error inserting employee attendance: ${error.message}`);
	}
}

async function addDepartment(departmentForm) {
	const { name, description, departmentPhoto } = departmentForm;

	const insertQuery = `INSERT INTO department(name, description, department_photo)
							 VALUES($1, $2, $3)`;

	try {
		await connection.query(insertQuery, [name, description, departmentPhoto]);
	} catch (error) {
		console.error(`Error inserting Department: ${error.message}`);
		throw new Error(`Error inserting Department: ${error.message}`);
	}
}

module.exports = {
	addEmployee,
	addDepartment,
	addEmployeeAttendance,
};
