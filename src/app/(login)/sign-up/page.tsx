'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';

const signUpSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	userName: z.string(),
	email: z.string().email(),
	password: z.string(),
	position: z.string(),
});

export default function SignUp() {
	const [step, setStep] = useState(1);

	const signUpForm = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			userName: '',
			email: '',
			password: '',
			position: '',
		},
	});

	const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
		console.log(values);
	};

	return (
		<div className='grid grid-cols-2 w-screen h-screen flex items-center'>
			<div className='flex items-center justify-center h-full bg-black'>
				<div className='flex flex-col gap-5 justify-start items-start w-full h-2/3 p-[10rem] pl-[3rem] text-white'>
					<h1 className='text-5xl'>Payroll done right and error-free.</h1>
					<p>
						Centralise your international employee payroll administration with
						Multiplier. Manage payroll and taxes for all your employees, wherever they
						are located compliantly.
					</p>

					<a
						href='/'
						className='m-10 ml-0 bg-white rounded-full text-black font-bold p-3 cursor-pointer hover:bg-gray-200'>
						About us
					</a>
				</div>
			</div>

			<main className='w-full h-full flex flex-col items-center justify-start pt-40'>
				<div className='flex flex-col gap-5 w-1/2 space-y-10'>
					<span className='space-y-10'>
						<h1 className='text-4xl'>Welcome to Payroll Systems</h1>
						<p className='label'>Create an account and start organizing your payroll</p>
					</span>

					<div className='w-full'>
						<Form {...signUpForm}>
							<form onSubmit={signUpForm.handleSubmit(onSubmit)}>
								{step === 1 && (
									<div className='space-y-7'>
										<h1>What are you?</h1>
										<FormField
											control={signUpForm.control}
											name='position'
											render={({ field }) => (
												<FormItem>
													<RadioGroup defaultValue='Owner'>
														<span className='flex gap-3 items-center p-5 border-[1px] border-gray-400 w-full rounded-sm'>
															<FormControl>
																<RadioGroupItem
																	{...field}
																	value='Owner'
																	id='Owner'
																/>
															</FormControl>
															<Label htmlFor='Owner'>
																<p>
																	I am a{' '}
																	<strong>Business owner</strong>.
																</p>
															</Label>
														</span>
														<span className='flex gap-3 items-center p-5 border-[1px] border-gray-400 w-full rounded-sm'>
															<FormControl>
																<RadioGroupItem
																	{...field}
																	value='Employee'
																	id='Employee'
																/>
															</FormControl>

															<Label htmlFor='Employee'>
																<p>
																	I am an{' '}
																	<strong>Employee</strong>.
																</p>
															</Label>
														</span>
													</RadioGroup>
												</FormItem>
											)}
										/>

										<Button
											className='w-full bg-black text-white'
											onClick={() => setStep(step + 1)}>
											Continue
										</Button>
									</div>
								)}

								{step === 2 && (
									<div className='grid grid-cols-2 gap-4'>
										<FormField
											name='firstName'
											control={signUpForm.control}
											render={({ field }) => (
												<FormItem>
													<FormLabel>First name</FormLabel>
													<FormControl>
														<Input
															{...field}
															placeholder='John'
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={signUpForm.control}
											name='lastName'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Last name</FormLabel>
													<FormControl>
														<Input
															placeholder='Doe'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={signUpForm.control}
											name='userName'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Username</FormLabel>
													<FormControl>
														<Input
															placeholder='Enter Username'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											control={signUpForm.control}
											name='email'
											render={({ field }) => (
												<FormItem>
													<FormLabel>Email</FormLabel>
													<FormControl>
														<Input
															placeholder='example@payroll.com'
															{...field}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className='col-span-2 w-1/2'>
											<FormField
												control={signUpForm.control}
												name='password'
												render={({ field }) => (
													<FormItem>
														<FormLabel>Password</FormLabel>
														<FormControl>
															<Input
																type='password'
																placeholder='Password'
																{...field}
															/>
														</FormControl>
														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
										<div className='col-span-2 w-1/2'>
											<FormLabel>Confirm Password</FormLabel>
											<Input
												type='password'
												placeholder='Confirm password'
											/>
										</div>
										<Button
											type='submit'
											className='w-full bg-black text-white col-span-2'>
											Submit
										</Button>

										<div className='flex col-span-2 justify-end'>
											<Button
												className='w-fit bg-gray-400 text-white'
												onClick={() => setStep(step - 1)}>
												Previous
											</Button>
										</div>
									</div>
								)}
							</form>
						</Form>
					</div>
					<span className='flex justify-end gap-1'>
						Already have an account?
						<a
							href='/login'
							className='underline'>
							Sign in
						</a>
					</span>
				</div>
			</main>
		</div>
	);
}
