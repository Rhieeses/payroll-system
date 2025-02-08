'use client';

import { useState, Suspense } from 'react';
import Layout from '@/components/custom-ui/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from './components/table';
import { columnsToday } from './components/columns-today';
import { useAttendanceDaily } from './hooks/attendance-hooks';
import { AttendanceWeekly } from './components/attendance-weekly';
import { TimeToday } from '@/components/utils/functions/time';

export default function Attendance() {
	const [currentTab, setCurrentTab] = useState<string>('today');
	const { attendanceDaily, loading, refetch } = useAttendanceDaily();

	return (
		<Layout>
			<>
				<p className='label text-sm'>
					<TimeToday />
				</p>
				<Tabs
					value={currentTab}
					onValueChange={(value) => setCurrentTab(value)}
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
							loading={loading}
						/>
					</TabsContent>

					<TabsContent value='weekly'>
						{currentTab === 'weekly' && (
							<Suspense fallback={<p>Loading...</p>}>
								<AttendanceWeekly />
							</Suspense>
						)}
					</TabsContent>
				</Tabs>
			</>
		</Layout>
	);
}
