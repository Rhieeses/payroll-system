'use client';

import { ColumnDef } from '@tanstack/react-table';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

export type DailyHours = {
	total_hours: number;
	total_overtime: number;
};

export type AttendanceSchema = {
	id: string;
	employee_name: string;
	employee_photo: string;
	department: string;
	position: string;
	total_hours: string;
	salary: any;
	overtime: string;
	time_in: string;
	time_out: string;
	attendance_id: null | string;
	status: string | null;
	weekly_hours: {
		Monday: DailyHours;
		Tuesday: DailyHours;
		Wednesday: DailyHours;
		Thursday: DailyHours;
		Friday: DailyHours;
		Saturday: DailyHours;
		Sunday: DailyHours;
	};
};

export const columns: ColumnDef<AttendanceSchema>[] = [
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
					variant='ghost'
					className='p-0'
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
		accessorKey: 'Monday',
		header: 'Monday',
		cell: ({ row }) => (
			<div className='flex gap-2'>
				<div className='capitalize'>
					<p className='label'>Total</p>
					<p className='text-center'>{row.original.weekly_hours.Monday.total_hours}</p>
				</div>
				<div className='capitalize'>
					<p className='label'>Overtime</p>
					<p className='text-center'>{row.original.weekly_hours.Monday.total_overtime}</p>
				</div>
			</div>
		),
	},

	{
		accessorKey: 'Tuesday',
		header: 'Tuesday',
		cell: ({ row }) => (
			<div className='flex gap-2'>
				<div className='capitalize'>
					<p className='label'>Total</p>
					<p className='text-center'>{row.original.weekly_hours.Tuesday.total_hours}</p>
				</div>
				<div className='capitalize'>
					<p className='label'>Overtime</p>
					<p className='text-center'>
						{row.original.weekly_hours.Tuesday.total_overtime}
					</p>
				</div>
			</div>
		),
	},

	{
		accessorKey: 'Wednesday',
		header: 'Wednesday',
		cell: ({ row }) => (
			<div className='flex gap-2'>
				<div className='capitalize'>
					<p className='label'>Total</p>
					<p className='text-center'>{row.original.weekly_hours.Wednesday.total_hours}</p>
				</div>
				<div className='capitalize'>
					<p className='label'>Overtime</p>
					<p className='text-center'>
						{row.original.weekly_hours.Wednesday.total_overtime}
					</p>
				</div>
			</div>
		),
	},

	{
		accessorKey: 'Thursday',
		header: 'Thursday',
		cell: ({ row }) => (
			<div className='flex gap-2'>
				<div className='capitalize'>
					<p className='label'>Total</p>
					<p className='text-center'>{row.original.weekly_hours.Thursday.total_hours}</p>
				</div>
				<div className='capitalize'>
					<p className='label'>Overtime</p>
					<p className='text-center'>
						{row.original.weekly_hours.Thursday.total_overtime}
					</p>
				</div>
			</div>
		),
	},

	{
		accessorKey: 'Friday',
		header: 'Friday',
		cell: ({ row }) => (
			<div className='flex gap-2'>
				<div className='capitalize'>
					<p className='label'>Total</p>
					<p className='text-center'>{row.original.weekly_hours.Friday.total_hours}</p>
				</div>
				<div className='capitalize'>
					<p className='label'>Overtime</p>
					<p className='text-center'>{row.original.weekly_hours.Friday.total_overtime}</p>
				</div>
			</div>
		),
	},

	{
		accessorKey: 'Saturday',
		header: 'Saturday',
		cell: ({ row }) => (
			<div className='flex gap-2'>
				<div className='capitalize'>
					<p className='label'>Total</p>
					<p className='text-center'>{row.original.weekly_hours.Saturday.total_hours}</p>
				</div>
				<div className='capitalize'>
					<p className='label'>Overtime</p>
					<p className='text-center'>
						{row.original.weekly_hours.Saturday.total_overtime}
					</p>
				</div>
			</div>
		),
	},

	{
		accessorKey: 'Sunday',
		header: 'Sunday',
		cell: ({ row }) => (
			<div className='flex gap-2'>
				<div className='capitalize'>
					<p className='label'>Total</p>
					<p className='text-center'>{row.original.weekly_hours.Sunday.total_hours}</p>
				</div>
				<div className='capitalize'>
					<p className='label'>Overtime</p>
					<p className='text-center'>{row.original.weekly_hours.Sunday.total_overtime}</p>
				</div>
			</div>
		),
	},

	{
		accessorKey: 'totalHours',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					className='p-0'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Total Hours
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			const weekly_hours = row.original.weekly_hours;

			const totalHours = Object.values(weekly_hours).reduce(
				(sum, day) => sum + day.total_hours,
				0,
			);

			return <div>{totalHours}</div>;
		},
		sortingFn: (rowA, rowB) => {
			const totalHoursA = Object.values(rowA.original.weekly_hours).reduce(
				(sum, day) => sum + day.total_hours,
				0,
			);

			const totalHoursB = Object.values(rowB.original.weekly_hours).reduce(
				(sum, day) => sum + day.total_hours,
				0,
			);

			return totalHoursA - totalHoursB;
		},
	},

	{
		accessorKey: 'overtime',
		header: ({ column }) => {
			return (
				<Button
					variant='ghost'
					className='p-0'
					onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
					Total Overtime
					<ArrowUpDown />
				</Button>
			);
		},
		cell: ({ row }) => {
			const weekly_hours = row.original.weekly_hours;

			const totalHours = Object.values(weekly_hours).reduce(
				(sum, day) => sum + day.total_overtime,
				0,
			);

			return <div>{totalHours}</div>;
		},
		sortingFn: (rowA, rowB) => {
			const totalHoursA = Object.values(rowA.original.weekly_hours).reduce(
				(sum, day) => sum + day.total_overtime,
				0,
			);

			const totalHoursB = Object.values(rowB.original.weekly_hours).reduce(
				(sum, day) => sum + day.total_overtime,
				0,
			);

			return totalHoursA - totalHoursB;
		},
	},

	{
		id: 'actions',
		enableHiding: false,
		cell: ({ row }) => {
			const payment = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button
							variant='ghost'
							className='h-8 w-8 p-0'>
							<span className='sr-only'>Open menu</span>
							<MoreHorizontal />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align='end'>
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>
							Copy payment ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem>View customer</DropdownMenuItem>
						<DropdownMenuItem>View payment details</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
