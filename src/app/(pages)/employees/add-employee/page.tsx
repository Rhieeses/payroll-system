'use client';
import { z } from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
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

const addEmployeeSchema = z.object({
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
	const router = useRouter();
	const { toast } = useToast();
	const [preview, setPreview] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [salary, setSalary] = useState('');
	//

	const [department, setDepartment] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [hasFetched, setHasFetched] = useState(false);

	const addEmployeeForm = useForm<z.infer<typeof addEmployeeSchema>>({
		resolver: zodResolver(addEmployeeSchema),
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

	const handleSalaryChange = (e: any) => {
		const rawValue = e.target.value;
		const formattedValue = formatSalary(rawValue);
		setSalary(formattedValue);
	};

	const fetchDepartmentChoice = async () => {
		if (hasFetched) return; // Prevent refetching if already fetched once
		setIsLoading(true);
		try {
			const response = await axios.get('/api/department-choices', { withCredentials: true });
			setDepartment(response.data);
			setHasFetched(true);
		} catch (error) {
			console.error('Error fetching choices:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFocus = () => {
		fetchDepartmentChoice();
	};

	const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; // Access the first file
		if (file) {
			setPreview(URL.createObjectURL(file)); // Generate preview URL
			addEmployeeForm.setValue('employeePhoto', file); // Update form value
		} else {
			setPreview(null);
			addEmployeeForm.setValue('employeePhoto', null); // Clear form value
		}
	};

	const onSubmit = async (values: z.infer<typeof addEmployeeSchema>) => {
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
				const response = await axios.post('/api/add-employee', formValues);

				const name = `${addEmployeeForm.getValues('firstName')} ${addEmployeeForm.getValues(
					'lastName',
				)} `;

				if (response.status === 200) {
					setMessage('Employee added!');
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
			setMessage('Failed to add employee. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Layout>
			<>
				<div className='header flex items-center gap-2 p-3'>
					<i
						className='bx bx-arrow-back bx-sm cursor-pointer hover:text-gray-300'
						onClick={() => router.back()}
					/>
					<p>Add Employee</p>
				</div>

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
												onOpenChange={handleFocus}
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
													value={salary} // Display the formatted salary
													onChange={handleSalaryChange} // Update the salary value on change
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
