const connection = require('../config/db');

async function fetchPayrollList(start, end) {
	const fetchQuery = `SELECT 
	employee.last_name || ', ' || employee.first_name AS employee_name,
	employee.position,
	employee.salary,
	employee.employee_photo,
	payroll.*
	FROM payroll  
	LEFT JOIN employee ON payroll.emp_id = employee.id
	WHERE payroll.payroll_date BETWEEN $1 AND $2
	ORDER BY 
	(CASE 
		WHEN payroll.status = 'Unpaid' THEN 0 
		ELSE 1 
	END),  
	employee.first_name;
		`;

	try {
		const result = await connection.query(fetchQuery, [start, end]);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch payroll list.');
	}
}

module.exports = { fetchPayrollList };
