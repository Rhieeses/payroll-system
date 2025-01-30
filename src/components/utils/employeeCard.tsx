'use client';

import { useRouter } from 'next/navigation';

export function EmployeeCard({ employeeItem }: { employeeItem: any }) {
	const router = useRouter();

	const handleClick = () => {
		router.push(`/employees/${employeeItem.id}`);
	};

	return (
		<div
			onClick={handleClick}
			className='rounded-md cursor-pointer hover:scale-[102%] duration-200'>
			<img
				src={employeeItem.employee_photo}
				alt={`${employeeItem.first_name} ${employeeItem.last_name} photo`}
				className='object-cover w-full h-[12rem] rounded-xl'
			/>
			<div className='p-3 pl-2'>
				<span className='flex justify-between'>
					<p className='font-[450] capitalize text-md'>
						{employeeItem.first_name} {employeeItem.last_name}
					</p>
					<p className='capitalize font-[450] text-sm'>{employeeItem.position}</p>
				</span>
				<p className='label capitalize text-sm'>{employeeItem.department}</p>
			</div>
		</div>
	);
}
