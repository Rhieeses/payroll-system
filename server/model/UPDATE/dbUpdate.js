const connection = require('../../config/db');

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

module.exports = {
	updateAttendance,
};
