'use client';
import { useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowUpDown, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AttendanceSchema } from './columns';
import { TimeToday } from '@/components/utils/functions/time';
import { useToast } from '@/hooks/use-toast';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { parseAbsoluteToLocal } from '@internationalized/date';
import { TimeInput } from '@nextui-org/date-input';
import axios from 'axios';

interface TimeProps {
	[key: string]: any;
}

function parseTimeOrNull(value: any): any {
	if (value) {
		return parseAbsoluteToLocal(value);
	}
	return null;
}

export const columnsToday = (refetch: () => void): ColumnDef<AttendanceSchema>[] => {
	const [rowData, setRowData] = useState<{
		[key: string]: {
			status: string;
			timeIn: TimeProps;
			timeOut: TimeProps;
		};
	}>({});
	const { toast } = useToast();

	const [loading, setLoading] = useState(false);

	const handleStatusChange = (rowId: string, status: string) => {
		setRowData((prev) => ({
			...prev,
			[rowId]: {
				...prev[rowId],
				status,
			},
		}));
	};

	const handleTimeIn = (rowId: string, timeIn: TimeProps) => {
		setRowData((prev) => ({
			...prev,
			[rowId]: {
				...prev[rowId],
				timeIn,
			},
		}));
	};

	const handleTimeOut = (rowId: string, timeOut: TimeProps) => {
		setRowData((prev) => ({
			...prev,
			[rowId]: {
				...prev[rowId],
				timeOut,
			},
		}));
	};

	const formEdit = async (rowId: string, attendanceId: string) => {
		setLoading(true);

		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();
		const day = now.getDate();

		const timeInRow = rowData?.[rowId]?.timeIn || null;
		const timeOutRow = rowData?.[rowId]?.timeOut || null;
		const statusRow = rowData?.[rowId]?.status || 'absent';
		let timeInUTC, timeOutUTC;

		if (timeInRow) {
			timeInUTC = new Date(
				Date.UTC(
					year,
					month,
					day,
					timeInRow.hour,
					timeInRow.minute,
					timeInRow.second,
					timeInRow.millisecond,
				),
			).toISOString();
		}

		if (timeOutRow) {
			timeOutUTC = new Date(
				Date.UTC(
					year,
					month,
					day,
					timeOutRow.hour,
					timeOutRow.minute,
					timeOutRow.second,
					timeOutRow.millisecond,
				),
			).toISOString();
		}

		if (statusRow === 'leave' || statusRow === 'absent') {
			timeInUTC = null;
			timeOutUTC = null;
		}

		try {
			console.log(timeInUTC, timeOutUTC);
			const response = await axios.patch(
				'/api/attendance/update-attendance',
				{
					attendanceId,
					timeInUTC,
					timeOutUTC,
					statusRow,
				},
				{ withCredentials: true },
			);
			if (response.status === 200) {
				toast({
					title: 'Employee Attendance Updated',
					description: 'Employee Time In/out Updated.',
				});
			}
		} catch (error: any) {
			console.error('An error occurred:', error.message || error);
		} finally {
			setLoading(false);
			refetch();
		}
	};

	const formSubmit = async (rowId: string) => {
		const now = new Date();
		const year = now.getFullYear();
		const month = now.getMonth();
		const day = now.getDate();

		const timeInRow = rowData?.[rowId]?.timeIn || null;
		const timeOutRow = rowData?.[rowId]?.timeOut || null;
		const statusRow = rowData?.[rowId]?.status || 'absent';
		let timeInUTC, timeOutUTC;

		if (timeInRow) {
			timeInUTC = new Date(
				Date.UTC(
					year,
					month,
					day,
					timeInRow.hour,
					timeInRow.minute,
					timeInRow.second,
					timeInRow.millisecond,
				),
			).toISOString();
		}

		if (timeOutRow) {
			timeOutUTC = new Date(
				Date.UTC(
					year,
					month,
					day,
					timeOutRow.hour,
					timeOutRow.minute,
					timeOutRow.second,
					timeOutRow.millisecond,
				),
			).toISOString();
		}

		if (statusRow === 'leave' || statusRow === 'absent') {
			timeInUTC = null;
			timeOutUTC = null;
		}

		try {
			const response = await axios.post('/api/attendance/add-attendance', {
				rowId,
				timeInUTC,
				timeOutUTC,
				statusRow,
			});
			if (response.status === 200) {
				toast({
					title: 'New Employee Timestamp Added',
					description: 'Employee Time In/out inserted.',
				});
				refetch();
			}
		} catch (error: any) {
			console.error('An error occurred:', error.message || error);
		} finally {
			setLoading(false);
		}
	};

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
			accessorKey: 'department',
			header: 'Department',
			cell: ({ row }) => <div className='capitalize'>{row.getValue('department')}</div>,
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
			accessorKey: 'TimeToday',
			header: TimeToday,
			cell: ({ row }: any) => {
				const { id, time_in, time_out, status } = row.original;
				const currentTimeIn: any = rowData[id]?.timeIn || parseTimeOrNull(time_in);
				const currentTimeOut: any = rowData[id]?.timeOut || parseTimeOrNull(time_out);
				const currentStatus: any = rowData[id]?.status || status;
				const statusFilter = ['present', 'late'];

				//onChange={(value) => handleTimeIn(id, value)}

				return (
					<div className='flex justify-between items-center justify-start'>
						<div className='flex flex-col w-1/2'>
							{statusFilter.includes(currentStatus) ? (
								<div className='flex gap-2'>
									<TimeInput
										classNames={{
											base: 'light-border rounded-xl',
											input: 'space-x-1',
											segment: 'focus:bg-gray-300 p-1',
										}}
										label='Time in'
										startContent={
											<i className='bx bx-time flex-shrink-0 mr-[1rem]'></i>
										}
										hourCycle={12}
										hideTimeZone
										isRequired
										value={currentTimeIn}
										onChange={(value) => handleTimeIn(id, value)}
									/>

									<TimeInput
										classNames={{
											base: 'light-border rounded-xl',
											input: 'space-x-1',
										}}
										label='Time out'
										startContent={
											<i className='bx bx-time flex-shrink-0 mr-[1rem]'></i>
										}
										hourCycle={12}
										isDisabled={!currentTimeIn}
										hideTimeZone
										value={currentTimeOut}
										onChange={(value) => handleTimeOut(id, value)}
										errorMessage='Should be higher than the time-out'
									/>
								</div>
							) : (
								<p className='label italic'>
									The employee is does not have time in/out.
								</p>
							)}
						</div>
					</div>
				);
			},
		},

		{
			accessorKey: 'status',
			header: 'Status',
			cell: ({ row }: any) => {
				const { id, status } = row.original;
				let currentStatus: any = rowData?.[id]?.status || status || 'absent';

				return (
					<div>
						<Select
							value={currentStatus}
							defaultValue='absent'
							onValueChange={(status) => handleStatusChange(id, status)}>
							<SelectTrigger className='w-[180px]'>
								<SelectValue placeholder='Status' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value='absent'>
										<p className='text-red-500'>Absent</p>
									</SelectItem>
									<SelectItem value='present'>
										<p className='text-green-500'>Present</p>
									</SelectItem>
									<SelectItem value='late'>
										<p className='text-orange-500'>Late</p>
									</SelectItem>
									<SelectItem value='leave'>
										<p className='text-blue-700'>Leave</p>
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>
				);
			},
		},

		{
			accessorKey: 'actions',
			header: 'Actions',
			cell: ({ row }: any) => {
				const { id, time_in, attendance_id, status, time_out } = row.original;

				const parsedTime = parseTimeOrNull(time_in);
				const parsedTimeOut = parseTimeOrNull(time_out);
				const timeStringRow = parsedTime ? `${parsedTime.hour}:${parsedTime.minute}` : '';
				const timeStringRowInput = rowData[id]?.timeIn
					? `${rowData[id]?.timeIn.hour}:${rowData[id]?.timeIn.minute}`
					: '';

				const timeStringRowOut = parsedTimeOut
					? `${parsedTimeOut.hour}:${parsedTimeOut.minute}`
					: '';
				const timeStringRowInputOut = rowData[id]?.timeOut
					? `${rowData[id]?.timeOut.hour}:${rowData[id]?.timeOut.minute}`
					: '';

				let statusFilter = rowData?.[id]?.status || status;
				let timeInCheck = rowData?.[id]?.timeIn || time_in;
				let timeOutCheck = rowData?.[id]?.timeOut || time_out;

				let disableButton;

				switch (statusFilter) {
					case 'present':
					case 'late':
						if (
							(timeStringRow === timeStringRowInput &&
								timeStringRowOut === timeStringRowInputOut) ||
							!timeInCheck ||
							!timeOutCheck
						) {
							disableButton = true;
						} else {
							disableButton = false;
						}

						break;
					case 'absent':
					case 'leave':
						if (rowData?.[id]?.status === status) {
							disableButton = true;
						} else {
							disableButton = false;
						}

						break;

					default:
						disableButton = true;
				}

				return (
					<div>
						{attendance_id ? (
							<Button
								className='p-5 w-full'
								disabled={disableButton}
								onClick={() => formEdit(id, attendance_id)}>
								{loading ? (
									<>
										<Loader className='animate-spin' />
										<span>Loading</span>
									</>
								) : (
									'Edit Attendance'
								)}
							</Button>
						) : (
							<Button
								className='p-5  w-full'
								disabled={loading}
								onClick={() => formSubmit(id)}>
								{loading ? (
									<>
										<Loader className='animate-spin' /> Loading{' '}
									</>
								) : (
									'Insert Attendance'
								)}
							</Button>
						)}
					</div>
				);
			},
		},
	];
};
