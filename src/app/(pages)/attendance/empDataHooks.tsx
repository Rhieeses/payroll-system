'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

export const useAttendance = () => {
	const [attendanceDaily, setAttendanceDaily] = useState([]);
	const [attendanceWeekly, setAttendanceWeekly] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchAttendanceDaily = async () => {
		setLoading(true);

		try {
			const attendanceResponse = await axios.get('/api/attendance-daily', {
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

	const fetchAttendanceWeekly = async () => {
		setLoading(true);
		try {
			const attendanceResponse = await axios.get('/api/attendance-weekly', {
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
		fetchAttendanceDaily();
		fetchAttendanceWeekly();
	}, []);

	return {
		attendanceDaily,
		attendanceWeekly,
		loading,
		error,
		refetch: fetchAttendanceDaily,
		fetchAttendanceWeekly,
	};
};

export const usePayroll = () => {
	const [payrollList, setPayrollList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchPayrollList = async () => {
		setLoading(true);

		try {
			const response = await axios.get('/api/payroll', {
				withCredentials: true,
			});

			setPayrollList(response.data);
		} catch (err: any) {
			console.error('Error fetching payroll data:', err);
			setError(err.response?.data?.error || 'An error occurred');
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPayrollList();
	}, []);

	return {
		payrollList,
		loading,
		error,
		refetch: fetchPayrollList,
	};
};
