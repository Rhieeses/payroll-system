import { EmployeeCard } from './employeeCard';
import { fetchEmployeeData } from './serverProps/employeeListProps';

export default async function EmployeeList() {
	const employeeData = await fetchEmployeeData();
	return (
		<div className='grid grid-cols-5 gap-10'>
			{employeeData.map((employeeItem) => (
				<EmployeeCard
					key={employeeItem.id}
					employeeItem={employeeItem}
				/>
			))}
		</div>
	);
}
