const connection = require('../../config/db');

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
	const fetchQuery = `SELECT * FROM employee WHERE id = $1;`;
	try {
		const result = await connection.query(fetchQuery, [id]);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch employee details.');
	}
}

async function fetchAttendanceDaily() {
	const fetchQuery = `SELECT 
		employee.id AS id, 
		attendance.id as attendance_id,
		first_name || ' ' || middle_name || ' ' || last_name AS employee_name,
		position, 
		department, 
		employee.salary,
		employee_photo, 
		COALESCE(SUM(attendance.total_hours), 0) AS total_hours,
		COALESCE(SUM(attendance.overtime), 0) AS overtime,
		attendance.time_in,
		attendance.time_out,
		attendance.status
	FROM 
		employee
	LEFT JOIN 
		attendance
		ON employee.id = attendance.emp_id AND attendance.created_at::date = CURRENT_DATE
	GROUP BY 
		employee.id, attendance_id,first_name, middle_name, last_name, position, department, employee_photo,attendance.time_in,
		attendance.time_out, attendance.status
	ORDER BY 
		employee.last_name;`;
	try {
		const result = await connection.query(fetchQuery);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch attendance daily.');
	}
}

async function fetchAttendanceWeekly() {
	const fetchQuery = `WITH days_of_week AS (
    SELECT unnest(ARRAY['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']) AS day_of_week
		),
		attendance_summary AS (
			SELECT 
				e.id AS id,
				e.first_name || ' ' || e.middle_name || ' ' || e.last_name AS employee_name,
				e.position,
				e.department,
				e.employee_photo,
				d.day_of_week,
				COALESCE(SUM(a.total_hours), 0) AS total_hours,
				COALESCE(SUM(a.overtime), 0) AS total_overtime
			FROM 
				employee e
			CROSS JOIN 
				days_of_week d
			LEFT JOIN 
				attendance a 
			ON 
				e.id = a.emp_id 
				AND TRIM(TO_CHAR(a.time_in, 'Day')) = d.day_of_week
			GROUP BY 
				e.id,e.first_name, e.middle_name,e.last_name, e.position, e.department, e.employee_photo, d.day_of_week
		)
		SELECT 
			id,
			employee_name,
			position,
			department,
			employee_photo,
			jsonb_object_agg(
				day_of_week,
				jsonb_build_object(
					'total_hours', total_hours,
					'total_overtime', total_overtime
				)
			) AS weekly_hours
		FROM 
			attendance_summary
		GROUP BY 
			id, employee_name, position, department, employee_photo
		ORDER BY 
			employee_name;`;
	try {
		const result = await connection.query(fetchQuery);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch employee attendance.');
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

async function fetchDepartmentList() {
	const fetchQuery = `SELECT id, name FROM department;`;
	try {
		const result = await connection.query(fetchQuery);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch departments.');
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

async function fetchPayrollList() {
	const cutOff = '2024-11-15';
	const cutOffStart = new Date(cutOff); // Convert to Date object
	const cutOffEnd = new Date(cutOff); // Create another Date object
	cutOffEnd.setDate(cutOffEnd.getDate() + 15); // Add 15 days

	const formattedCutOffStart = cutOffStart.toISOString().split('T')[0];
	const formattedCutOffEnd = cutOffEnd.toISOString().split('T')[0];

	const fetchQuery = `SELECT 
		employee.id AS id, 
		
		first_name || ' ' || middle_name || ' ' || last_name AS employee_name,
		position, 
		department, 
		employee.salary,
		employee_photo, 
		COALESCE(SUM(attendance.total_hours), 0) AS total_hours,
		COALESCE(SUM(attendance.overtime), 0) AS overtime
	FROM 
		employee
	LEFT JOIN 
		attendance
		ON employee.id = attendance.emp_id AND attendance.created_at::date BETWEEN $1 AND $2
	GROUP BY 
		employee.id,first_name, middle_name, last_name, position, department, employee_photo, employee.salary
		
	ORDER BY 
		employee.last_name;`;
	try {
		const result = await connection.query(fetchQuery, [
			formattedCutOffStart,
			formattedCutOffEnd,
		]);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch payroll list.');
	}
}

module.exports = {
	fetchEmployees,
	fetchEmployeeDetails,
	fetchAttendanceDaily,
	fetchAttendanceWeekly,
	fetchDepartments,
	fetchDepartmentList,
	fetchEmployeeList,
	fetchPayrollList,
};
