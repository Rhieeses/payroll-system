import Layout from '@/components/custom-ui/layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import getEmployeeDetails from '../actions/employee-details';
import { formatDate, formatNumber, formatDateToTime } from '@/components/utils/functions/formatter';
import BackButton from '@/components/custom-ui/back-button';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { TerminateEmployee } from './terminate-button';

type EmployeeCardProps = {
	empId: number;
};

export default async function EmployeeCard(empId: EmployeeCardProps) {
	const employee = await getEmployeeDetails(empId);

	const empDetails = employee.empDetails;
	const empAttendance = employee.attendance;
	const empPayroll = employee.payroll;

	if (!employee) {
		return null;
	}

	return (
		<Layout>
			<div className='employee-details  p-5'>
				<BackButton>Back</BackButton>
				<div className='flex border-b-[1px] p-5 items-center justify-between'>
					<div className='emp-avatar flex items-center gap-5'>
						<img
							src={empDetails.employee_photo}
							alt='employee'
							width={150}
							height={150}
							className='rounded-2xl'
						/>
						<div className='flex flex-col items-start'>
							<h1 className='capitalize font-medium text-xl'>
								{empDetails.full_name}
							</h1>
							<span className='capitalize label text-sm'>{empDetails.position}</span>
						</div>
					</div>
					<TerminateEmployee empId={empId} />
				</div>

				<div className='flex gap-5 p-5'>
					<ul className='pr-5 space-y-5 **:span:label *:space-y-2 w-fit border-r-[1px]'>
						<li>
							<p className='text-sm'>Employee Details</p>
						</li>
						<li>
							<span className='label text-sm'>Salary</span>
							<h3>{formatNumber(empDetails.salary)}</h3>
						</li>
						<li>
							<span className=' label text-sm'>Department</span>
							<h3 className='capitalize'>{empDetails.department}</h3>
						</li>
						<li>
							<span className='label text-sm'>Email</span>
							<h3>{empDetails.email}</h3>
						</li>
						<li>
							<span className='label text-sm'>Contact number</span>
							<h3>{empDetails.contact_no}</h3>
						</li>
						<li>
							<span className='label text-sm'>Birthday</span>
							<h3>{formatDate(empDetails.birthday)}</h3>
						</li>

						<li>
							<span className='label text-sm'>Date Join</span>
							<h3>{formatDate(empDetails.created_at)}</h3>
						</li>
					</ul>

					<div className='flex w-full'>
						<Tabs
							defaultValue='attendance'
							className='w-full'>
							<TabsList className='grid w-full grid-cols-2 bg-white focus:bg-black'>
								<TabsTrigger value='attendance'>Attendance</TabsTrigger>
								<TabsTrigger value='payroll'>Payroll</TabsTrigger>
							</TabsList>
							<TabsContent
								value='attendance'
								className='w-full h-full border-[1px] p-2 rounded-lg'>
								<AttendanceTable attendance={empAttendance} />
							</TabsContent>
							<TabsContent
								value='payroll'
								className='w-full h-full border-[1px] p-2 rounded-lg'>
								<PayrollTable payroll={empPayroll} />
							</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</Layout>
	);
}

const AttendanceTable = ({ attendance }: any) => {
	return (
		<Table>
			<TableCaption>Employee Attendance</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>ID </TableHead>
					<TableHead>Date </TableHead>
					<TableHead>Time in</TableHead>
					<TableHead>Time out</TableHead>
					<TableHead>Total Hours</TableHead>
					<TableHead>Overtime Hours</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{attendance.length > 0 ? (
					attendance.map((item: any) => (
						<TableRow key={item.id}>
							<TableCell>{item.id}</TableCell>
							<TableCell>{formatDate(item.created_at)}</TableCell>
							<TableCell>{formatDateToTime(item.time_in)}</TableCell>
							<TableCell>{formatDateToTime(item.time_out)}</TableCell>
							<TableCell>{item.total_hours}</TableCell>
							<TableCell>{item.overtime}</TableCell>
							<TableCell className='capitalize'>{item.status}</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell>No Payroll Data</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

const PayrollTable = ({ payroll }: any) => {
	return (
		<Table>
			<TableCaption>Employee Payroll</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>ID </TableHead>
					<TableHead>Total Hours</TableHead>
					<TableHead>Total Overtime</TableHead>
					<TableHead>Total salary </TableHead>
					<TableHead>Payroll Date</TableHead>
					<TableHead>Status</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{payroll.length > 0 ? (
					payroll.map((item: any) => (
						<TableRow key={item.id}>
							<TableCell>{item.id}</TableCell>
							<TableCell>{item.total_hours}</TableCell>
							<TableCell>{item.total_overtime}</TableCell>
							<TableCell>{item.total_salary}</TableCell>
							<TableCell>{formatDate(item.payroll_date)}</TableCell>
							<TableCell className='uppercase'>{item.status}</TableCell>
						</TableRow>
					))
				) : (
					<TableRow>
						<TableCell>No Payroll Data</TableCell>
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};
