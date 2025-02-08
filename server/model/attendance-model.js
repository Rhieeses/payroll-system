const connection = require('../config/db');

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

async function fetchAttendanceWeekly(weekRange) {
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
				AND a.time_in >= (CURRENT_DATE - ($1 * INTERVAL '1 week') - (EXTRACT(DOW FROM CURRENT_DATE) - 1) * INTERVAL '1 day')
				AND a.time_in < (CURRENT_DATE - (EXTRACT(DOW FROM CURRENT_DATE)) * INTERVAL '1 day')
			GROUP BY 
				e.id, e.first_name, e.middle_name, e.last_name, e.position, e.department, e.employee_photo, d.day_of_week
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
			employee_name;
		`;
	try {
		const result = await connection.query(fetchQuery, [weekRange]);
		return result.rows;
	} catch (error) {
		throw new Error('Failed to fetch employee attendance.');
	}
}

async function updateAttendance(attendanceUpdate) {
	const { attendanceId, timeInUTC, timeOutUTC, statusRow } = attendanceUpdate;

	const insertQuery = `
		UPDATE attendance
        SET 
			time_in = $1,
			time_out = $2,
			status = $3
        WHERE id = $4;`;

	try {
		await connection.query(insertQuery, [timeInUTC, timeOutUTC, statusRow, attendanceId]);
	} catch (error) {
		console.error(`Error updating attendance: ${error.message}`);
		throw new Error(`Error updating attendance: ${error.message}`);
	}
}

async function addAttendance(employeeAttendanceForm) {
	const { rowId, timeInUTC, timeOutUTC, statusRow } = employeeAttendanceForm;

	const insertQuery = `INSERT INTO attendance(emp_id, time_in, time_out, status) VALUES($1, $2, $3, $4)`;

	try {
		await connection.query(insertQuery, [rowId, timeInUTC, timeOutUTC, statusRow]);
	} catch (error) {
		console.error(`Error inserting employee attendance: ${error.message}`);
		throw new Error(`Error inserting employee attendance: ${error.message}`);
	}
}

module.exports = { fetchAttendanceDaily, fetchAttendanceWeekly, updateAttendance, addAttendance };
