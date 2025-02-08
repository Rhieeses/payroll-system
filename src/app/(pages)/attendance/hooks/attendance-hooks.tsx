'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

type usePayrollProps = {
	payrollStart: Date | null;
	payrollEnd: Date | null;
};

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

export const usePayroll = ({ payrollStart, payrollEnd }: usePayrollProps) => {
	const [payrollList, setPayrollList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchPayrollList = async () => {
		if (!payrollStart || !payrollEnd) return;

		setLoading(true);

		try {
			const response = await axios.get('/api/payroll/payroll-list', {
				withCredentials: true,
				params: {
					start: payrollStart?.toISOString().split('T')[0],
					end: payrollEnd?.toISOString().split('T')[0],
				},
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
	}, [payrollStart, payrollEnd]);

	return {
		payrollList,
		loading,
		error,
		refetch: fetchPayrollList,
	};
};
