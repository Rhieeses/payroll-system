'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAttendanceDaily = () => {
	const [attendanceDaily, setAttendanceDaily] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAttendanceDaily = async () => {
		setLoading(true);

		try {
			const attendanceResponse = await axios.get('/api/attendance/daily', {
				withCredentials: true,
			});

			setAttendanceDaily(attendanceResponse.data);
		} catch (err: any) {
			console.error('Error fetching attendance data:', err);
			setError(err.response?.data?.error || 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAttendanceDaily();
	}, []);

	return {
		attendanceDaily,
		loading,
		error,
		refetch: fetchAttendanceDaily,
	};
};

export const useAttendanceWeekly = (weekRange: number) => {
	const [attendanceWeekly, setAttendanceWeekly] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAttendanceWeekly = async (weekRange: number) => {
		setLoading(true);
		try {
			const attendanceResponse = await axios.get('/api/attendance/weekly', {
				params: { weekRange },
				withCredentials: true,
			});

			setAttendanceWeekly(attendanceResponse.data);
		} catch (err: any) {
			console.error('Error fetching attendance data:', err);
			setError(err.response?.data?.error || 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchAttendanceWeekly(weekRange);
	}, [weekRange]);

	return {
		attendanceWeekly,
		loading,
		error,
		refetch: fetchAttendanceWeekly,
	};
};
