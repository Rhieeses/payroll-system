'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { DateRange } from '../components/payroll-range';

type PayrollDateProps = {
	handleStart: (start: Date) => void;
	handleEnd: (end: Date) => void;
};

export const PayrollDate = ({ handleStart, handleEnd }: PayrollDateProps) => {
	const [payrollRange, setPayrollRange] = useState<number>(0);

	const handleDateChange = useCallback(
		(start: Date, end: Date) => {
			handleStart(start);
			handleEnd(end);
		},
		[handleStart, handleEnd],
	);

	return (
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
	);
};
