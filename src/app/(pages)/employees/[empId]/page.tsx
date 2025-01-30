'use client';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { formatNumber, formatDate } from '@/components/utils/functions/formatter';
import Layout from '@/components/custom-ui/layout';
import { use } from 'react';
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import EmployeeSchema from '@/components/utils/schema/schema';

const invoices = [
	{
		invoice: 'INV001',
		paymentStatus: 'Paid',
		totalAmount: '$250.00',
		paymentMethod: 'Credit Card',
	},
	{
		invoice: 'INV002',
		paymentStatus: 'Pending',
		totalAmount: '$150.00',
		paymentMethod: 'PayPal',
	},
	{
		invoice: 'INV003',
		paymentStatus: 'Unpaid',
		totalAmount: '$350.00',
		paymentMethod: 'Bank Transfer',
	},
	{
		invoice: 'INV004',
		paymentStatus: 'Paid',
		totalAmount: '$450.00',
		paymentMethod: 'Credit Card',
	},
	{
		invoice: 'INV005',
		paymentStatus: 'Paid',
		totalAmount: '$550.00',
		paymentMethod: 'PayPal',
	},
	{
		invoice: 'INV006',
		paymentStatus: 'Pending',
		totalAmount: '$200.00',
		paymentMethod: 'Bank Transfer',
	},
	{
		invoice: 'INV007',
		paymentStatus: 'Unpaid',
		totalAmount: '$300.00',
		paymentMethod: 'Credit Card',
	},
];

export default function EmployeeDetails({ params }: { params: Promise<{ empId: number }> }) {
	const paramsObj = use(params);
	const id = paramsObj.empId;
	const router = useRouter();

	const [employeeData, setEmployeeData] = useState<EmployeeSchema | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const fetchData = async (id: number) => {
			setLoading(true);
			try {
				const response = await axios.get(`/api/employee-details/${id}`, {
					withCredentials: true,
				});
				setEmployeeData(response.data[0]);
			} catch (error) {
				console.error('Error fetching employee data:', error);
			} finally {
				setLoading(false);
			}
		};

		if (id) fetchData(id);
	}, [id]);

	useEffect(() => {
		console.log('Updated Employee Data:', employeeData);
	}, [employeeData]);

	if (loading) return <p className='label'>Loading...</p>;
	if (!employeeData) return <p className='label'>No employee data found.</p>;

	return (
		<Layout>
			<div className='mx-auto bg-white rounded-xl p-6'>
				<span className='flex items-center gap-2 pb-5'>
					<i
						className='bx bx-arrow-back bx-sm hover:text-gray-400 cursor-pointer'
						onClick={() => router.back()}></i>
					<h2 className='text-md capitalize font-semibold'>{`${employeeData?.first_name} ${employeeData?.middle_name} ${employeeData?.last_name}`}</h2>
				</span>
				<div className='space-y-4'>
					<div className='grid grid-cols-3 gap-5'>
						<div>
							<img
								src={employeeData?.employee_photo}
								alt='employee-photo'
								className='object-contain rounded-xl'
							/>
							<div className='rounded-lg light-border shadow-sm mt-[2rem] p-2'>
								<div className='p-2'>
									<p className='font-semibold text-md'>Employee Details</p>
								</div>
								<div className='p-5 pt-0 space-y-3'>
									<div className='flex justify-between gap-3 items-center'>
										<span className='flex gap-2 items-center w-1/4 text-sm'>
											<i className='bx bx-user bx-sm text-gray-500'></i>
											<p>Name</p>
										</span>

										<p className='capitalize font-medium'>{`${employeeData?.first_name} ${employeeData?.middle_name} ${employeeData?.last_name}`}</p>
									</div>
									<div className='flex justify-between gap-3 items-center'>
										<span className='flex gap-3 items-center'>
											<i className='bx bx-sitemap bx-sm text-gray-500'></i>
											<p>Department</p>
										</span>
										<p className='capitalize font-medium'>
											{employeeData?.department}
										</p>
									</div>
									<div className='flex justify-between gap-3 items-center'>
										<span className='flex gap-3 items-center'>
											<i className='bx bx-briefcase bx-sm text-gray-500'></i>
											<p>Position</p>
										</span>

										<p className='capitalize font-medium'>
											{employeeData?.position}
										</p>
									</div>

									<div className='flex justify-between gap-3 items-center'>
										<span className='flex gap-3 items-center'>
											<i className='bx bx-money bx-sm text-gray-500'></i>
											<p>Salary</p>
										</span>

										<p className='capitalize font-medium'>
											{formatNumber(employeeData?.salary)}
										</p>
									</div>

									<div className='flex justify-between gap-3 items-center'>
										<span className='flex gap-3 items-center'>
											<i className='bx bx-money bx-sm text-gray-500'></i>
											<p>Joined on</p>
										</span>

										<p className='capitalize font-medium'>
											{formatDate(employeeData?.created_at)}
										</p>
									</div>
								</div>
							</div>
						</div>

						<div className='col-span-2 max-h-full overflow-y-auto'>
							<p className='font-medium text-lg'>Recent Payrolls</p>
							<Table aria-label='Recent payrolls'>
								<TableCaption>Recent payrolls</TableCaption>
								<TableHeader>
									<TableRow>
										<TableHead className='w-[100px]'>Invoice</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Method</TableHead>
										<TableHead className='text-right'>Amount</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{invoices.map((invoice) => (
										<TableRow key={invoice.invoice}>
											<TableCell className='font-medium'>
												{invoice.invoice}
											</TableCell>
											<TableCell>{invoice.paymentStatus}</TableCell>
											<TableCell>{invoice.paymentMethod}</TableCell>
											<TableCell className='text-right'>
												{invoice.totalAmount}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
								<TableFooter>
									<TableRow>
										<TableCell colSpan={3}>Total</TableCell>
										<TableCell className='text-right'>$2,500.00</TableCell>
									</TableRow>
								</TableFooter>
							</Table>
						</div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
