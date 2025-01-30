import axios from 'axios';

interface EmployeeSchema {
	first_name: string;
	middle_name: string;
	last_name: string;
	email: string;
	contact_no: string;
	birthday: string;
	department: string;
	created_at: string;
	employee_photo: string;
	position: string;
}

const fetchEmployeeData = async () => {
	try {
		const response = await axios.get(`${process.env.PORT_URL}/api/employee-list`, {
			withCredentials: true,
		});

		if (!response.data || !Array.isArray(response.data)) {
			throw new Error('Invalid response format');
		}
		return response.data;
	} catch (error) {
		console.error('Error fetching employee data:', error);
		throw new Error('Failed to fetch data');
	}
};

export default async function Page() {
	const employeeData = await fetchEmployeeData();

	return (
		<div className='grid grid-cols-5 gap-10'>
			{employeeData.map((employeeItem) => (
				<div
					key={employeeItem.email} // Use a unique key, e.g., email
					className='border-[1px] border-gray-200 rounded-md shadow-lg cursor-pointer hover:bg-gray-200'>
					<img
						src={employeeItem.employee_photo}
						alt={`${employeeItem.first_name} ${employeeItem.last_name} photo`}
						className='object-cover w-full h-[15rem]' // Fixed "object-fit" typo
					/>
					<div className='p-5 pl-2'>
						<span className='flex justify-between'>
							<p className='font-semibold'>
								{employeeItem.first_name} {employeeItem.last_name}
							</p>
							<p>{employeeItem.position}</p>
						</span>
						<p className='label'>{employeeItem.department}</p>
					</div>
				</div>
			))}
		</div>
	);
}
