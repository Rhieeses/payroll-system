import Layout from '@/components/custom-ui/layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EmployeeList from '../../../components/utils/employeeList';
import Link from 'next/link';

export default function Employees() {
	return (
		<Layout>
			<>
				<section className='flex justify-between items-center mb-20'>
					<span className='flex items-center w-1/4'>
						<i className='bx bx-search bx-sm absolute pl-1 text-gray-500' />
						<Input
							className='p-5 pl-8 capitalize'
							placeholder='Search employee...'
						/>
					</span>
					<Link href='/employees/add-employee'>
						<Button>
							<i className='bx bx-plus bx-sm' />
							New Employee
						</Button>
					</Link>
				</section>
				<EmployeeList />
			</>
		</Layout>
	);
}
