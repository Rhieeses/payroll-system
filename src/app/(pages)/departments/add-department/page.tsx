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

const addDepartmentSchema = z.object({
	name: z.string(),
	description: z.string(),
	departmentPhoto: z.any().refine((file) => file && file.size > 0, 'A photo is required.'),
});

//	departmentHead: z.string(),

export default function AddDepartment() {
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

	const addDepartmentForm = useForm<z.infer<typeof addDepartmentSchema>>({
		resolver: zodResolver(addDepartmentSchema),
		defaultValues: {
			name: '',

			description: '',
			departmentPhoto: null,
		},
	});

	//departmentHead: '',

	/** 
	const fetchEmployeeChoice = async () => {
		if (hasFetched) return; // Prevent refetching if already fetched once
		setIsLoading(true);
		try {
			const response = await axios.get('/api/employee-choices', { withCredentials: true });
			setDepartment(response.data);
			setHasFetched(true);
		} catch (error) {
			console.error('Error fetching choices:', error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFocus = () => {
		fetchEmployeeChoice();
	};*/

	const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]; // Access the first file
		if (file) {
			setPreview(URL.createObjectURL(file)); // Generate preview URL
			addDepartmentForm.setValue('departmentPhoto', file); // Update form value
		} else {
			setPreview(null);
			addDepartmentForm.setValue('departmentPhoto', null); // Clear form value
		}
	};

	const onSubmit = async (values: z.infer<typeof addDepartmentSchema>) => {
		setLoading(true);
		try {
			const departmentPhoto = addDepartmentForm.getValues('departmentPhoto');

			const formPhoto = new FormData();
			formPhoto.append('file', departmentPhoto);

			const uploadResponse = await axios.post('/api/upload-photo', formPhoto, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			if (uploadResponse.status === 200) {
				addDepartmentForm.setValue('departmentPhoto', uploadResponse.data.filePath);

				const formValues = addDepartmentForm.getValues();
				const response = await axios.post('/api/department/add-department', formValues);
				const name = addDepartmentForm.getValues('name');

				if (response.status === 200) {
					setMessage('Department added!');
					toast({
						title: 'New Department Added',
						description: `${name}`,
					});

					addDepartmentForm.reset();
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
					<p>Add Department</p>
				</div>

				<div className='p-10 pt-5'>
					<h1 className='mb-[2rem]'>Department Details</h1>
					<Form {...addDepartmentForm}>
						<form
							onSubmit={addDepartmentForm.handleSubmit(onSubmit)}
							className='grid grid-cols-2 gap-5'>
							<div className='grid grid-cols-2 gap-5'>
								<FormField
									control={addDepartmentForm.control}
									name='name'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder='name'
													className='capitalize'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{/**	<FormField
									control={addDepartmentForm.control}
									name='departmentHead'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Department Head</FormLabel>
											<Select
												onValueChange={field.onChange}
												onOpenChange={handleFocus}
												defaultValue={field.value}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder='Select a employee' />
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
															No Employee found.
														</SelectItem>
													) : (
														department.map((option) => (
															<SelectItem
																key={option.id}
																value={option.id}>
																{option.name}
															</SelectItem>
														))
													)}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/> */}

								<FormField
									control={addDepartmentForm.control}
									name='description'
									render={({ field }) => (
										<FormItem>
											<FormLabel>Description</FormLabel>
											<FormControl>
												<Input
													required
													{...field}
													className='capitalize'
													placeholder='description'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='col-span-2 space-y-5 w-full'>
									<FormField
										control={addDepartmentForm.control}
										name='departmentPhoto'
										render={() => (
											<FormItem>
												<FormLabel>Department photo</FormLabel>
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
