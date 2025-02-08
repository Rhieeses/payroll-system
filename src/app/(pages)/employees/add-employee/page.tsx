'use client';
import { z } from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import Layout from '@/components/custom-ui/layout';
import {
	Form,
	FormControl,
	FormItem,
	FormField,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatSalary, cleanInput } from '@/components/utils/functions/formatter';
import { getDepartmentList } from './actions/get-department-list';
import BackButton from '@/components/custom-ui/back-button';

const EmployeeSchema = z.object({
	firstName: z.string(),
	middleName: z.string().optional(),
	lastName: z.string(),
	dateOfBirth: z.string().date(),
	department: z.string(),
	position: z.string(),
	salary: z.string().min(0, { message: 'minimum amount' }).max(12, { message: 'max amount' }),
	email: z.string().email(),
	contactNumber: z
		.string()
		.min(10, { message: 'minimum length' })
		.max(13, { message: 'max length' }),
	employeePhoto: z.any().refine((file) => file && file.size > 0, 'A photo is required.'),
});

export default function AddEmployee() {
	const { toast } = useToast();
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [salary, setSalary] = useState('');
	const [department, setDepartment] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchDepartments = async () => {
			const { department } = await getDepartmentList();
			setDepartment(department);
			setIsLoading(false);
		};

		fetchDepartments();
	}, []);

	const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const rawValue = e.target.value;
		const formattedValue = formatSalary(rawValue);
		setSalary(formattedValue);
	};

	const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setPreview(URL.createObjectURL(file));
			addEmployeeForm.setValue('employeePhoto', file);
		} else {
			setPreview(null);
			addEmployeeForm.setValue('employeePhoto', null);
		}
	};

	const addEmployeeForm = useForm<z.infer<typeof EmployeeSchema>>({
		resolver: zodResolver(EmployeeSchema),
		defaultValues: {
			firstName: '',
			middleName: '',
			lastName: '',
			dateOfBirth: '',
			department: '',
			position: '',
			salary: '',
			email: '',
			contactNumber: '',
			employeePhoto: null,
		},
	});

	const onSubmit = async () => {
		setLoading(true);
		try {
			const employeePhoto = addEmployeeForm.getValues('employeePhoto');

			const formPhoto = new FormData();
			formPhoto.append('file', employeePhoto);

			const uploadResponse = await axios.post('/api/upload-photo', formPhoto, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (uploadResponse.status === 200) {
				const salary = addEmployeeForm.getValues('salary');
				addEmployeeForm.setValue('employeePhoto', uploadResponse.data.filePath);
				addEmployeeForm.setValue('salary', cleanInput(salary));

				const formValues = addEmployeeForm.getValues();
				const response = await axios.post('/api/employee/add-employee', formValues);

				const name = `${addEmployeeForm.getValues('firstName')} ${addEmployeeForm.getValues(
					'lastName',
				)} `;

				if (response.status === 200) {
					toast({
						title: 'New Employee Added!',
						description: `${name}`,
					});

					addEmployeeForm.reset();
					setPreview(null);
				}
			}
		} catch (error: any) {
			console.error('An error occurred:', error.message || error);
			toast({
				title: 'Failed to add an employee',
				description: `${error.message}`,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<>
				<BackButton>Back to Employees</BackButton>

				<div className='p-10 pt-5'>
					<h1 className='mb-[2rem]'>Employee Details</h1>
					<Form {...addEmployeeForm}>
						<form
							onSubmit={addEmployeeForm.handleSubmit(onSubmit)}
							className='grid grid-cols-2 gap-5'>
							<div className='grid grid-cols-2 gap-5'>
								<div className='grid grid-cols-3 gap-5 col-span-2'>
									<FormField
										control={addEmployeeForm.control}
										name='firstName'
										render={({ field }) => (
											<FormItem>
												<FormLabel>First name</FormLabel>
												<FormControl>
													<Input
														{...field}
														required
														placeholder='First name'
														className='capitalize'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={addEmployeeForm.control}
										name='lastName'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Last name</FormLabel>
												<FormControl>
													<Input
														{...field}
														required
														placeholder='Last name'
														className='capitalize'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={addEmployeeForm.control}
										name='middleName'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Middle name</FormLabel>
												<FormControl>
													<Input
														{...field}
														placeholder='Middle name'
														className='capitalize'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>
								<FormField
									control={addEmployeeForm.control}
									name='dateOfBirth'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Date of Birth</FormLabel>
											<FormControl>
												<Input
													{...field}
													type='date'
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<div className='col-span-2 grid grid-cols-2 gap-5'>
									<FormField
										control={addEmployeeForm.control}
										name='email'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														{...field}
														required
														placeholder='example@email.com'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={addEmployeeForm.control}
										name='contactNumber'
										render={({ field }) => (
											<FormItem>
												<FormLabel>Contact no.</FormLabel>
												<FormControl>
													<Input
														{...field}
														required
														type='number'
														placeholder='Contact no.'
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={addEmployeeForm.control}
									name='department'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Department</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.name}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Select a department' />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{isLoading ? (
														<SelectItem value='loading'>
															Loading
														</SelectItem>
													) : department.length === 0 ? (
														<SelectItem
															value='null'
															disabled>
															No Departments found.
														</SelectItem>
													) : (
														department.map((option) => (
															<SelectItem
																key={option.id}
																value={option.name}>
																{option.name}
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={addEmployeeForm.control}
									name='position'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Position</FormLabel>
											<FormControl>
												<Input
													required
													{...field}
													className='capitalize'
													placeholder='Position'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={addEmployeeForm.control}
									name='salary'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Salary per month</FormLabel>
											<FormControl>
												<Input
													required
													{...field}
													value={salary}
													onChange={handleSalaryChange}
													placeholder='Salary'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<div className='space-y-5 w-full'>
								<FormField
									control={addEmployeeForm.control}
									name='employeePhoto'
									render={() => (
										<FormItem>
											<FormLabel>Employee photo</FormLabel>
											<FormControl>
												<Input
													required
													className='w-fit'
													type='file'
													onChange={handlePhoto}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{preview && (
									<img
										src={preview}
										alt='preview-photo'
										className='object-contain h-[20rem] w-full border-[1px] p-2 rounded-md'
									/>
								)}
							</div>

							<div className='flex justify-end col-span-3 mt-[2rem]'>
								<Button type='submit'>
									{loading ? (
										<i className='bx bx-loader-alt bx-spin bx-rotate-90  bx-sm' />
									) : (
										<i className='bx bx-plus bx-sm' />
									)}
									Employee
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</>
		</Layout>
	);
}
