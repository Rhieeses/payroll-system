'use client';

import Layout from '@/components/custom-ui/layout';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { usePayroll } from '../attendance/hooks/attendance-hooks';
import { DataTable } from './components/table';
import { columns } from './components/columns';
import { Button } from '@/components/ui/button';

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
		let monthsToSubtract = Math.floor(payrollRange / 2);
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

const DateRange = ({ payrollRange, onDateChange }: dateRangeProps) => {
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

export default function Payroll() {
	const [payrollStart, setPayrollStart] = useState<Date | null>(null);
	const [payrollEnd, setPayrollEnd] = useState<Date | null>(null);

	const { payrollList, error, loading, refetch } = usePayroll({ payrollStart, payrollEnd });
	const memoizedColumns = useMemo(() => columns(refetch), [refetch]);

	const [payrollRange, setPayrollRange] = useState<number>(0);

	const handleDateChange = useCallback((start: Date, end: Date) => {
		setPayrollStart(start);
		setPayrollEnd(end);
	}, []);

	return (
		<Layout>
			<>
				<div className=''>
					<h1>Payroll Date</h1>
					<span className='flex items-center gap-2'>
						<Button
							onClick={() => setPayrollRange((prev) => prev + 1)}
							variant='ghost'
							className='p-0 h-fit text-lg'>
							<i className='bx bx-chevron-left light-border rounded-md p-1' />
						</Button>

						<DateRange
							payrollRange={payrollRange}
							onDateChange={handleDateChange}
						/>
						<Button
							disabled={payrollRange === 0}
							onClick={() => setPayrollRange((prev) => prev - 1)}
							variant='ghost'
							className='p-0 h-fit  text-lg'>
							<i className='bx bx-chevron-right light-border rounded-md p-1' />
						</Button>
					</span>
				</div>

				<DataTable
					columns={memoizedColumns}
					data={payrollList}
					loading={loading}
				/>
			</>
		</Layout>
	);
}
