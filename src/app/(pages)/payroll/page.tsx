'use client';

import Layout from '@/components/custom-ui/layout';
import { useState, useMemo } from 'react';
import { usePayroll } from './hooks/use-payroll';
import { PayrollTable } from './components/payroll-table';
import { columns } from './components/columns';
import { PayModal } from './components/pay-modal';
import { PayrollDate } from './components/payroll-date';

export default function Payroll() {
	const [payrollStart, setPayrollStart] = useState<Date | null>(null);
	const [payrollEnd, setPayrollEnd] = useState<Date | null>(null);
	const [selectedRow, setSelectedRow] = useState<any>(null);

	const { payrollList, error, loading, refetch } = usePayroll({ payrollStart, payrollEnd });
	const memoizedColumns = useMemo(() => columns(setSelectedRow), [setSelectedRow]);

	return (
		<Layout>
			<PayrollDate
				handleStart={setPayrollStart}
				handleEnd={setPayrollEnd}
			/>

			<PayrollTable
				columns={memoizedColumns}
				data={payrollList}
				loading={loading}
			/>
			<PayModal
				employeeData={selectedRow}
				onClose={() => setSelectedRow(null)}
			/>
		</Layout>
	);
}
