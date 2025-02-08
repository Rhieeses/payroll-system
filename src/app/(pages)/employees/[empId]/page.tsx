import EmployeeCard from './components/employee-card';
import { Suspense } from 'react';

type ParamsProps = {
	params: {
		empId: number;
	};
};

export default async function EmployeeDetails({ params }: ParamsProps) {
	const { empId } = await params;
	return (
		<Suspense fallback={<span>loading...</span>}>
			<EmployeeCard empId={empId} />
		</Suspense>
	);
}
