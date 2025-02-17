import { setupCache } from 'axios-cache-interceptor';
import axios from 'axios';
import { cookies } from 'next/headers';

const api = setupCache(axios.create());

type payrollProps = {
	id: number;
	total_hours: number;
	total_overtime: number;
	total_salary: number;
	payroll_date: string;
};

type attendanceProps = {
	id: number;
	time_in: string;
	time_out: string;
	total_hours: number;
	overtime: number;
	status: string;
	created_at: string;
};

type employeeProps = {
	id: number;
	full_name: string;
	email: string;
	contact_no: string;
	employee_photo: string;
	birthday: string;
	department: string;
	position: string;
	created_at: string;
	salary: number;
};

type employeeDetailsResponse = {
	empDetails: employeeProps;
	payroll: payrollProps[];
	attendance: attendanceProps[];
};

export default async function getEmployeeDetails({
	empId,
}: {
	empId: number;
}): Promise<employeeDetailsResponse> {
	const cookie = await cookies();
	const token = cookie.get('token');

	if (!token) {
		throw new Error('No token found');
	}

	try {
		const response = await api.get(
			`${process.env.PORT_URL}/api/employee/employee-details/${empId}`,
			{
				headers: {
					Authorization: `Bearer ${token.value}`,
				},

				cache: {
					ttl: 1000 * 70 * 5,
				},
			},
		);
		return response.data;
	} catch (error) {
		console.error('Error fetching employee details', error);
		throw new Error('Failed to fetch employee details');
	}
}
