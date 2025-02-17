'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

type usePayrollProps = {
	payrollStart: Date | null;
	payrollEnd: Date | null;
};

export const usePayroll = ({ payrollStart, payrollEnd }: usePayrollProps) => {
	const [payrollList, setPayrollList] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const fetchPayrollList = async () => {
		//if (!payrollStart || !payrollEnd) return;

		setLoading(true);

		try {
			//console.log(payrollStart, payrollEnd);
			const response = await axios.get('/api/payroll/payroll-list', {
				withCredentials: true,
				params: {
					start: payrollStart?.toLocaleDateString('en-CA').split('T')[0],
					end: payrollEnd?.toLocaleDateString('en-CA').split('T')[0],
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
		if (payrollStart && payrollEnd) fetchPayrollList();
	}, [payrollStart, payrollEnd]);

	return {
		payrollList,
		loading,
		error,
		refetch: fetchPayrollList,
	};
};
