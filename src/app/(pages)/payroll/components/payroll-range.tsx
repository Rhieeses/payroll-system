'use client';

import { useState, useEffect } from 'react';

type dateRangeProps = {
	payrollRange: number;
	onDateChange: (start: Date, end: Date) => void;
};

const formatDate = (date: any) => {
	console.log('rerendering');
	const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Singapore' };
	return date.toLocaleDateString('en-SG', options);
};

const getPayrollRange = (payrollRange: number) => {
	const today = new Date();

	let startDayPayroll = new Date(today);
	let endDayPayroll = new Date(today);

	if (today.getDate() > 15) {
		startDayPayroll.setDate(16);
		endDayPayroll = new Date(today.getFullYear(), today.getMonth() + 1, 0);
	} else {
		startDayPayroll.setDate(1);
		endDayPayroll.setDate(15);
	}

	if (payrollRange !== 0) {
		let monthsToSubtract = Math.ceil(payrollRange / 2);
		startDayPayroll.setMonth(startDayPayroll.getMonth() - monthsToSubtract);
		endDayPayroll.setMonth(endDayPayroll.getMonth() - monthsToSubtract);

		if (payrollRange % 2 !== 0) {
			if (startDayPayroll.getDate() === 1) {
				startDayPayroll.setDate(16);
				endDayPayroll = new Date(
					endDayPayroll.getFullYear(),
					endDayPayroll.getMonth() + 1,
					0,
				);
			} else {
				startDayPayroll.setDate(1);
				endDayPayroll.setDate(15);
			}
		}
	}

	return {
		startDate: startDayPayroll,
		endDate: endDayPayroll,
	};
};

export const DateRange = ({ payrollRange, onDateChange }: dateRangeProps) => {
	const [payrollStart, setPayrollStart] = useState('');
	const [payrollEnd, setPayrollEnd] = useState('');

	useEffect(() => {
		const { startDate, endDate } = getPayrollRange(payrollRange);
		setPayrollStart(formatDate(startDate));
		setPayrollEnd(formatDate(endDate));
		onDateChange(startDate, endDate);
	}, [payrollRange]);

	return (
		<p className='text-sm'>
			{payrollStart} - {payrollEnd}
		</p>
	);
};
