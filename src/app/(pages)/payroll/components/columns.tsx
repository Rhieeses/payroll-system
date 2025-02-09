'use client';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttendanceSchema } from '../../attendance/components/columns';
import { formatNumber } from '@/components/utils/functions/formatter';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

export const columns = (
	setSelectedRow: (employeeRowData: any) => void,
): ColumnDef<AttendanceSchema>[] => {
	return [
		{
			accessorKey: 'id',
			header: ({ column }) => {
				return (
					<Button
						className='p-0'
						variant='ghost'
						onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
						ID
						<ArrowUpDown />
					</Button>
				);
			},
			cell: ({ row }) => <div>{row.getValue('id')}</div>,
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
			cell: ({ row }) => {
				const { employee_name, employee_photo } = row.original;
				const fallbackName = employee_name
					.split(' ')
					.map((c) => c.charAt(0).toUpperCase())
					.join('');

				return (
					<div className='capitalize flex items-center gap-2'>
						<Avatar>
							<AvatarImage
								src={employee_photo}
								alt={employee_name}
							/>
							<AvatarFallback>{fallbackName}</AvatarFallback>
						</Avatar>
						{row.getValue('employee_name')}
					</div>
				);
			},
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
				return <div className='capitalize'>{formatNumber(row.getValue('salary'))}</div>;
			},
		},

		{
			accessorKey: 'perHour',
			header: 'Pay/Hour',

			cell: ({ row }) => {
				const { salary } = row.original;
				const hourlyRate: number = parseFloat((salary / 173.3).toFixed(2));

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
			accessorKey: 'total_overtime',
			header: 'Overtime Hours',
			cell: ({ row }) => (
				<div className='flex gap-2 capitalize'>
					<p>{row.getValue('total_overtime')}</p>
					<p className='label'>Hours</p>
				</div>
			),
		},

		{
			accessorKey: 'total_salary',
			header: 'Gross Pay',
			cell: ({ row }: any) => {
				return <div>{formatNumber(row.getValue('total_salary'))}</div>;
			},
		},

		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }: any) => {
				const status = row.getValue('status');
				return (
					<Badge
						variant='default'
						className={`uppercase rounded-full p-1 pointer-events-none ${
							status === 'unpaid' ? 'bg-red-500' : 'bg-green-500'
						} `}>
						{status}
					</Badge>
				);
			},
		},

		{
			accessorKey: 'actions',
			header: 'Actions',
			cell: ({ row }: any) => {
				return (
					<div className='flex items-center justify-center gap-2'>
						<Button onClick={() => setSelectedRow(row.original)}>Pay</Button>
					</div>
				);
			},
		},
	];
};
