'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAttendanceWeekly } from '../hooks/attendance-hooks';
import { DataTable } from '../components/table';
import { columns } from '../components/columns';

const formatDate = (date: any) => {
	const options = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Singapore' };
	return date.toLocaleDateString('en-SG', options);
};

const getWeekRange = (weekRange: number) => {
	const today = new Date();

	const firstDayOfWeek = new Date(today);
	firstDayOfWeek.setDate(today.getDate() - today.getDay() + 1);

	if (weekRange !== 0) {
		firstDayOfWeek.setDate(firstDayOfWeek.getDate() - 7 * weekRange);
	}

	const lastDayOfWeek = new Date(firstDayOfWeek);
	lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

	return {
		startDate: firstDayOfWeek,
		endDate: lastDayOfWeek,
	};
};

const DateRange = ({ weekRange }: { weekRange: number }) => {
	const [weekStartDate, setWeekStartDate] = useState('');
	const [weekEndDate, setWeekEndDate] = useState('');

	useEffect(() => {
		const { startDate, endDate } = getWeekRange(weekRange);
		setWeekStartDate(formatDate(startDate));
		setWeekEndDate(formatDate(endDate));
	}, [weekRange]);

	return (
		<p className='text-sm'>
			{weekStartDate} - {weekEndDate}
		</p>
	);
};

export const AttendanceWeekly = () => {
	const [weekRange, setWeekRange] = useState<number>(0);
	const { attendanceWeekly, loading } = useAttendanceWeekly(weekRange);

	return (
		<div>
			<span className='flex items-center gap-2'>
				<Button
					onClick={() => setWeekRange((prev) => prev + 1)}
					variant='ghost'
					className='p-0 h-fit text-lg'>
					<i className='bx bx-chevron-left light-border rounded-md p-1' />
				</Button>

				<DateRange weekRange={weekRange} />
				<Button
					disabled={weekRange === 0}
					onClick={() => setWeekRange((prev) => prev - 1)}
					variant='ghost'
					className='p-0 h-fit  text-lg'>
					<i className='bx bx-chevron-right light-border rounded-md p-1' />
				</Button>
			</span>

			<DataTable
				columns={columns}
				data={attendanceWeekly}
				loading={loading}
			/>
		</div>
	);
};
