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
	const fetchQuery = `SELECT 
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
	try {
		const result = await connection.query(fetchQuery, [id]);
		return result.rows;
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
module.exports = { AddEmployee, fetchEmployees, fetchEmployeeDetails, fetchEmployeeList };
