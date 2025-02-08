import Layout from '@/components/custom-ui/layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import getEmployeeDetails from '../actions/employee-details';
import { formatDate, formatNumber } from '@/components/utils/functions/formatter';
import BackButton from '@/components/custom-ui/back-button';

type EmployeeCardProps = {
	empId: number;
};

export default async function EmployeeCard(empId: EmployeeCardProps) {
	const employee = await getEmployeeDetails(empId);

	return (
		<Layout>
			<div className='employee-details  p-5'>
				<BackButton>Back</BackButton>
				<div className='flex border-b-[1px] p-5 items-center justify-between'>
					<div className='emp-avatar flex items-center gap-5'>
						<img
							src={employee.employee_photo}
							alt='employee'
							width={150}
							height={150}
							className='rounded-2xl'
						/>
						<div className='flex flex-col items-start'>
							<h1 className='capitalize font-medium text-xl'>{employee.full_name}</h1>
							<span className='capitalize label text-sm'>{employee.position}</span>
						</div>
					</div>

					<div>
						<Button variant='destructive'>Terminate</Button>
					</div>
				</div>

				<div className='flex gap-5 p-5'>
					<ul className='pr-5 space-y-5 **:span:label *:space-y-2 w-fit border-r-[1px]'>
						<li>
							<p className='text-sm'>Employee Details</p>
						</li>
						<li>
							<span className='label text-sm'>Salary</span>
							<h3>{formatNumber(employee.salary)}</h3>
						</li>
						<li>
							<span className=' label text-sm'>Department</span>
							<h3 className='capitalize'>{employee.department}</h3>
						</li>
						<li>
							<span className='label text-sm'>Email</span>
							<h3>{employee.email}</h3>
						</li>
						<li>
							<span className='label text-sm'>Contact number</span>
							<h3>{employee.contact_no}</h3>
						</li>
						<li>
							<span className='label text-sm'>Birthday</span>
							<h3>{formatDate(employee.birthday)}</h3>
						</li>

						<li>
							<span className='label text-sm'>Date Join</span>
							<h3>{formatDate(employee.created_at)}</h3>
						</li>
					</ul>

					<div className='flex w-full'>
						<Tabs
							defaultValue='account'
							className='w-full'>
							<TabsList className='grid w-full grid-cols-3 bg-white focus:bg-black'>
								<TabsTrigger value='payroll'>Payroll</TabsTrigger>
								<TabsTrigger value='attendance'>Attendance</TabsTrigger>
								<TabsTrigger value='invoice'>Invoices</TabsTrigger>
							</TabsList>
							<TabsContent
								value='payroll'
								className='w-full h-full border-[1px] p-2 rounded-lg'>
								<div>sd</div>
							</TabsContent>
							<TabsContent value='password'>hells</TabsContent>
						</Tabs>
					</div>
				</div>
			</div>
		</Layout>
	);
}
