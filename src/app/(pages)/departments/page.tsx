import Layout from '@/components/custom-ui/layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import DepartmentList from './components/departmentList';
import { Suspense } from 'react';

export default function Departments() {
	return (
		<Layout>
			<>
				<section className='flex justify-between items-center'>
					<span className='flex items-center w-1/4 '>
						<i className='bx bx-search bx-sm absolute pl-1 text-gray-500' />
						<Input
							className='p-5 pl-8 capitalize'
							placeholder='Search department...'
						/>
					</span>
					<Link href='/departments/add-department'>
						<Button>
							<i className='bx bx-plus bx-sm' />
							New Department
						</Button>
					</Link>
				</section>
				<Suspense fallback={<p>Loading...</p>}>
					<DepartmentList />
				</Suspense>
			</>
		</Layout>
	);
}
