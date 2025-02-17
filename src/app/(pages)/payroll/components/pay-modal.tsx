import { AttendanceSchema } from '../../attendance/components/columns';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { formatDate } from '@/components/utils/functions/formatter';
import { useState } from 'react';

type ExtendedEmployeeData = AttendanceSchema & {
	payroll_date: string;
	employee_photo: string;
	total_overtime: number;
	total_salary: number;
};

type PayModalProps = {
	employeeData: ExtendedEmployeeData;
	onClose: () => void;
};

export const PayModal = ({ employeeData, onClose }: PayModalProps) => {
	if (!employeeData) return null;

	const [section, setSection] = useState('pay');

	const dateToday = new Date();
	const payrollDate = new Date(employeeData.payroll_date);

	const isPayrollToday = payrollDate === dateToday;
	return (
		<Dialog
			open={!!employeeData}
			onOpenChange={onClose}>
			<DialogContent className='max-w-2xl'>
				<DialogHeader>
					<DialogTitle>Payslip</DialogTitle>
					<DialogDescription>Verify employee hours and deductions.</DialogDescription>
				</DialogHeader>
				{section === 'pay' ? <PayslipContent employeeData={employeeData} /> : null}
				<DialogFooter>
					<span className='text-left w-full label'>
						You can pay at the end of the payroll period
					</span>
					{section === 'pay' ? (
						<Button
							disabled={!isPayrollToday}
							onClick={() => setSection('done')}>
							Pay Employee
						</Button>
					) : (
						<Button onClick={() => setSection('pay')}>Submit</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

const PayslipContent = ({ employeeData }: { employeeData: ExtendedEmployeeData }) => {
	const deductions = (): { sss: number; philhealth: number; pagibig: number; total: number } => {
		const salary = employeeData.salary;

		const sss = Number((salary * 0.045).toFixed(2));
		const philhealth = Number(((salary * 0.05) / 2).toFixed(2));
		const pagibig = 200.0;
		const total = sss + philhealth + pagibig;

		return {
			sss,
			philhealth,
			pagibig,
			total,
		};
	};

	const employeeDeductions = deductions();

	return (
		<div id='payslip'>
			<div className='grid grid-cols-2 gap-5'>
				<img
					src={employeeData.employee_photo}
					alt={employeeData.employee_name}
					className='rounded-xl aspect-[2/1]'
				/>
				<div className='grid *:grid *:grid-cols-3 *:items-center'>
					<div className=''>
						<Label htmlFor='username'>ID</Label>
						<span
							id='name'
							className='col-span-2'>
							{employeeData.id}
						</span>
					</div>
					<div>
						<Label htmlFor='name'>Employee</Label>
						<span
							id='name'
							className='col-span-2 capitalize'>
							{employeeData.employee_name}
						</span>
					</div>

					<div>
						<Label htmlFor='name'>Pay Period</Label>
						<span
							id='name'
							className='col-span-2'>
							{formatDate(employeeData.payroll_date)}
						</span>
					</div>

					<div>
						<Label htmlFor='name'>Salary</Label>
						<span
							id='salary'
							className='col-span-2'>
							₱ {employeeData.salary}
						</span>
					</div>
				</div>
			</div>

			<Table className=''>
				<TableHeader>
					<TableRow>
						<TableHead colSpan={2}>Earnings</TableHead>
						<TableHead className='text-right'>Amount</TableHead>
						<TableHead colSpan={2}>Deductions</TableHead>
						<TableHead className='text-right'>Amount</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<TableRow>
						<TableCell
							colSpan={2}
							className='text-sm'>
							<ul className='pl-0 p-10'>
								<li>Rate per Hour</li>
								<li>Overtime Rate </li>
								<li>Hours Worked</li>
								<li>Overtime</li>
							</ul>
						</TableCell>
						<TableCell className='text-right font-medium'>
							<ul>
								<li>₱40</li>
								<li>₱40</li>
								<li title='hours-work'>{Number(employeeData.total_hours)} /hrs</li>
								<li title='overtime-hours'>
									{Number(employeeData.total_overtime)} /hrs
								</li>
							</ul>
						</TableCell>
						<TableCell
							colSpan={2}
							className='text-sm'>
							<ul className='pl-0 p-10'>
								<li>SSS</li>
								<li>Pag-ibig</li>
								<li>Philhealth</li>
							</ul>
						</TableCell>
						<TableCell className='text-right font-medium'>
							<ul>
								<li>₱ {employeeDeductions.sss}</li>
								<li>₱ {employeeDeductions.philhealth}</li>
								<li>₱ {employeeDeductions.pagibig}</li>
							</ul>
						</TableCell>
					</TableRow>
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell className='font-semibold'>Gross Earnings</TableCell>
						<TableCell
							colSpan={3}
							className='text-right font-semibold'>
							₱ {employeeData.total_salary}
						</TableCell>
						<TableCell className='font-semibold'>Deductions</TableCell>
						<TableCell
							colSpan={2}
							className='text-right font-semibold'>
							₱ {employeeDeductions.total.toFixed(2)}
						</TableCell>
					</TableRow>
					<TableRow className='bg-green-100'>
						<TableCell
							colSpan={5}
							className='font-bold text-lg'>
							Net Pay
						</TableCell>
						<TableCell
							colSpan={3}
							className='text-right font-bold text-lg'>
							₱ {(employeeData.total_salary - employeeDeductions.total).toFixed(2)}
						</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</div>
	);
};

const PayEmployee = () => {
	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Payslip</DialogTitle>
				<DialogDescription>Verify employee hours and deductions.</DialogDescription>
			</DialogHeader>
		</DialogContent>
	);
};
