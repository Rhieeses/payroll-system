const connection = require('../config/db');

async function fetchDepartmentList() {
	const fetchQuery = `SELECT id, name FROM department;`;
	try {
		const result = await connection.query(fetchQuery);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch departments.');
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

async function fetchDepartments() {
	const fetchQuery = `SELECT * FROM department;`;
	try {
		const result = await connection.query(fetchQuery);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch employees.');
	}
}

module.exports = { fetchDepartmentList, addDepartment, fetchDepartments };
