'use client';

import Layout from '@/components/custom-ui/layout';
import { usePayroll } from '../attendance/empDataHooks';

import { DataTable } from './table';
import { columns } from './columns';

export default function Payroll() {
	const { payrollList, error, loading, refetch } = usePayroll();

	return (
		<Layout>
			<>
				<span className='flex items-center gap-2'>
					<i className='bx bx-chevron-left light-border rounded-md p-1'></i>
					<p className='label'>November 1, 2024 - November 15, 2024</p>
					<i className='bx bx-chevron-right light-border rounded-md p-1'></i>
				</span>

				<DataTable
					columns={columns(refetch)}
					data={payrollList}
				/>
			</>
		</Layout>
	);
}
