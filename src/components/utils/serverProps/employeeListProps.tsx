import axios from 'axios';
import { cookies } from 'next/headers';
import EmployeeSchema from '../schema/schema';

export const fetchEmployeeData = async (): Promise<EmployeeSchema[]> => {
	const cookieStore = await cookies();
	const token = cookieStore.get('token');

	if (!token) {
		throw new Error('Token is not available');
	}

	try {
		const response = await axios.get(`${process.env.PORT_URL}/api/employee-list`, {
			headers: {
				Authorization: `Bearer ${token.value}`,
			},
		});

		if (!response.data || !Array.isArray(response.data)) {
			throw new Error('Invalid response format');
		}

		return response.data;
	} catch (error) {
		console.error('Error fetching employee data:', error);
		return [];
	}
};
