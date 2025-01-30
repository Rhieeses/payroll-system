'use client';
import { useState } from 'react';
import Layout from '@/components/custom-ui/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from './table';
import { AttendanceSchema, columns } from './columns';
import { columnsToday } from './columnsToday';
import { useAttendance } from './empDataHooks';
import { TimeToday } from '@/components/utils/functions/time';

/** 
async function attendanceData(): Promise<AttendanceSchema[]> {
	return [
		{
			id: '001',
			name: 'John Doe',
			position: 'Manager',
			payPerHour: 20,
			weeklyHours: {
				Monday: { workHours: 7.5, overtimeHours: 1 },
				Tuesday: { workHours: 7.75, overtimeHours: 0.5 },
				Wednesday: { workHours: 8, overtimeHours: 1 },
				Thursday: { workHours: 8, overtimeHours: 2 },
				Friday: { workHours: 8, overtimeHours: 2 },
				Saturday: { workHours: 7, overtimeHours: 2 },
				Sunday: { workHours: 8, overtimeHours: 5 },
			},
		},
		{
			id: '002',
			name: 'Jane Smith',
			position: 'Developer',
			payPerHour: 25,
			weeklyHours: {
				Monday: { workHours: 8, overtimeHours: 1 },
				Tuesday: { workHours: 7, overtimeHours: 1 },
				Wednesday: { workHours: 7.5, overtimeHours: 1 },
				Thursday: { workHours: 8, overtimeHours: 1 },
				Friday: { workHours: 7.5, overtimeHours: 1 },
				Saturday: { workHours: 3, overtimeHours: 1 },
				Sunday: { workHours: 5, overtimeHours: 1 },
			},
		},
	];
}*/

export default function Attendance() {
	const { attendanceDaily, attendanceWeekly, error, refetch } = useAttendance();

	//console.log(employeeName);

	return (
		<Layout>
			<>
				<p className='label text-sm'>
					<TimeToday />
				</p>
				<Tabs
					defaultValue='today'
					className=''>
					<TabsList className='my-2'>
						<TabsTrigger value='today'>Today</TabsTrigger>
						<TabsTrigger value='weekly'>Weekly</TabsTrigger>
					</TabsList>
					<TabsContent value='today'>
						<DataTable
							columns={columnsToday(refetch)}
							data={attendanceDaily}
						/>
					</TabsContent>
					<TabsContent value='weekly'>
						<div>
							<span className='flex items-center gap-2'>
								<i className='bx bx-chevron-left light-border rounded-md p-1'></i>
								<p className='text-sm'>November 18, 2024 - November 24, 2024</p>
								<i className='bx bx-chevron-right light-border rounded-md p-1'></i>
							</span>

							<DataTable
								columns={columns}
								data={attendanceWeekly}
							/>
						</div>
					</TabsContent>
				</Tabs>
			</>
		</Layout>
	);
}
