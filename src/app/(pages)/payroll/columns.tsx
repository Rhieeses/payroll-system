'use client';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttendanceSchema } from '../attendance/columns';
import { formatNumber } from '@/components/utils/functions/formatter';
import { useState } from 'react';

export const columns = (refetch: () => void): ColumnDef<AttendanceSchema>[] => {
	return [
		{
			id: 'select',
			header: ({ table }) => (
				<Checkbox
					checked={
						table.getIsAllPageRowsSelected() ||
						(table.getIsSomePageRowsSelected() && 'indeterminate')
					}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label='Select all'
				/>
			),
			cell: ({ row }) => (
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label='Select row'
				/>
			),
			enableSorting: false,
			enableHiding: false,
		},

		{
			accessorKey: 'employee_name',
			header: ({ column }) => {
				return (
					<Button
						className='p-0'
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						Name
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => <div className='capitalize'>{row.getValue('employee_name')}</div>,
		},

		{
			accessorKey: 'position',
			header: 'Position',
			cell: ({ row }) => <div className='capitalize'>{row.getValue('position')}</div>,
		},

		{
			accessorKey: 'salary',
			header: 'Salary',

			cell: ({ row }) => {
				return (
					<div className='capitalize'>{formatNumber(row.getValue('salary'))} /hour</div>
				);
			},
		},

		{
			accessorKey: 'perHour',
			header: 'Pay/Hour',
			//{formatNumber(row.getValue('salary'))}

			cell: ({ row }) => {
				const { salary } = row.original;
				const hourlyRate: number = parseFloat((salary / 173.2).toFixed(2));

				return <div className='capitalize'>{formatNumber(hourlyRate)} /hour</div>;
			},
		},

		{
			accessorKey: 'total_hours',
			header: 'Total Hours',
			cell: ({ row }) => (
				<div className='flex gap-2 capitalize'>
					<p>{row.getValue('total_hours')}</p>
					<p className='label'>Hours</p>
				</div>
			),
		},

		{
			accessorKey: 'overtime',
			header: 'Overtime Hours',
			cell: ({ row }) => (
				<div className='flex gap-2 capitalize'>
					<p>{row.getValue('overtime')}</p>
					<p className='label'>Hours</p>
				</div>
			),
		},

		{
			accessorKey: 'grossPay',
			header: 'Gross Pay',
			cell: ({ row }: any) => {
				const { salary, overtime, total_hours } = row.original;
				const hourlyRate: number = parseFloat((salary / 173.2).toFixed(2));

				const totalHoursPay = total_hours * hourlyRate;
				const overtimePay = hourlyRate * 1.2;

				const grossPay = totalHoursPay + overtimePay;

				return <div>{formatNumber(grossPay)}</div>;
			},
		},

		{
			accessorKey: 'actions',
			header: 'Actions',
			cell: ({ row }: any) => {
				return (
					<div className='flex items-center justify-center gap-2'>
						<Button>Pay</Button>

						<Button>View</Button>
					</div>
				);
			},
		},
	];
};
