import axios from 'axios';
import { cookies } from 'next/headers';

type departmentSchema = {
	id: number;
	name: string;
	description: string;
	deparment_head: string;
	department_photo: string;
};

const fetchDepartments = async (): Promise<departmentSchema[]> => {
	const cookieStore = await cookies();
	const token = cookieStore.get('token');

	if (!token) {
		throw new Error('Token is not available');
	}

	try {
		const response = await axios.get(`${process.env.PORT_URL}/api/department/department-list`, {
			headers: {
				Authorization: `Bearer ${token.value}`,
			},
		});

		if (!response.data || !Array.isArray(response.data)) {
			throw new Error('Invalid response format');
		}

		return response.data;
	} catch (error) {
		console.error('Error fetching departments data:', error);
		return [];
	}
};

export default async function DepartmentList() {
	const departmentList = await fetchDepartments();

	return (
		<div className='grid grid-cols-3 gap-5'>
			{departmentList.length === 0 ? (
				<div className='col-span-3 text-center text-gray-500'>No departments found</div>
			) : (
				departmentList.map((departmentItem) => (
					<div
						key={departmentItem.id}
						className='relative light-border rounded-md bg-no-repeat bg-center bg-cover h-[15rem] w-full'>
						<div className='relative flex flex-col items-center justify-center h-2/3 rounded-t-md bg-white border-b-[1px] border-slate-900 z-10'>
							<h1 className='text-3xl capitalize'>{departmentItem.name}</h1>
							<p className='max-w-md text-center text-gray-500 capitalize'>
								{departmentItem.description}
							</p>
						</div>
						<div>
							<img
								src={departmentItem.department_photo}
								alt='department photo'
								className='bg-no-repeat bg-center bg-cover w-full h-full w-full absolute top-0 z-0'
							/>
						</div>
						<div className='inset-0 top-2/3 absolute bg-slate-900 opacity-70'></div>
					</div>
				))
			)}
		</div>
	);
}
