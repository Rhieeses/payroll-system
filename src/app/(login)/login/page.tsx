'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
	username: z.string(),
	password: z.string(),
});

export default function Login() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');

	const loginForm = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: '',
			password: '',
		},
	});

	const onLogin = async (values: z.infer<typeof loginSchema>) => {
		setLoading(true);
		try {
			const response = await axios.post('/api/login', values);
			//console.log('Response status:', response.status);
			if (response.status === 200) {
				setMessage('Login Successful!');
				router.push('/dashboard');
				setLoading(false);
			}
			loginForm.reset({
				...loginForm.getValues(),
				password: '',
			});
		} catch (error) {
			setLoading(false);
			setMessage('Username or password is incorrect!');
			loginForm.reset({
				...loginForm.getValues(),
				password: '',
			});
		}
	};

	return (
		<div className='grid grid-cols-2 w-screen h-screen flex items-center'>
			<div className='flex items-center justify-center h-full bg-black'>
				<div className='flex flex-col gap-5 justify-start items-start w-full h-2/3 p-[10rem] pl-[3rem] text-white'>
					<h1 className='text-5xl'>Welcome to Your Payroll Powerhouse!</h1>
					<p>
						Manage payroll like never before with our easy, efficient, and secure system
						built to take the hassle out of payday.
					</p>

					<a
						href='/'
						className='m-10 ml-0 bg-white rounded-full text-black font-bold p-3 cursor-pointer hover:bg-gray-200'>
						About us
					</a>
				</div>
			</div>

			<main className='w-full h-full flex flex-col items-center justify-center'>
				<div className='flex flex-col gap-5 w-1/2'>
					<span className='flex flex-col gap-2 text-center'>
						<h1 className='text-3xl'>Sign In</h1>
						<p className='label'>Welcome! Please enter your username and password.</p>
					</span>

					<div className='flex gap-5'>
						<span className='flex gap-5 items-center p-2 border-[1px] w-full cursor-pointer hover:bg-gray-100'>
							<i className='bx bxl-google bx-sm' />
							<p className='text-sm'>Sign in with Google</p>
						</span>

						<span className='flex gap-5 items-center p-2 border-[1px] w-full cursor-pointer hover:bg-gray-100'>
							<i className='bx bxl-microsoft bx-sm' />
							<p className='text-sm'>Sign in with Microsoft</p>
						</span>
					</div>
					<span className='flex items-center justify-center text-center relative'>
						<div className='absolute border-b-[1px] w-full z-0'></div>
						<p className='z-10 pl-2 pr-2 bg-white'>or</p>
					</span>
					<Form {...loginForm}>
						<form
							onSubmit={loginForm.handleSubmit(onLogin)}
							className='space-y-5'>
							<FormField
								control={loginForm.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-md'>Username</FormLabel>
										<FormControl>
											<div className='flex items-center relative'>
												<i className='bx bx-user bx-sm absolute left-6 mt-2' />
												<Input
													type='text'
													required
													placeholder='Enter your username.'
													className='p-7 pl-14 rounded-2xl mt-2'
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={loginForm.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-md'>Password</FormLabel>
										<FormControl>
											<div className='flex items-center relative'>
												<i className='bx bx-key bx-sm absolute left-6 mt-2' />
												<Input
													type='password'
													required
													placeholder='Enter your password.'
													className='p-7 pl-14 rounded-2xl mt-2'
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className='flex items-center justify-between'>
								<span className='flex items-center gap-2'>
									<Checkbox name='remember' />
									<Label
										htmlFor='remember'
										className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
										Remember me
									</Label>
								</span>
								<p className='label text-sm cursor-pointer'>Forgot Password</p>
							</div>

							<Button
								type='submit'
								disabled={loading}
								className='p-8 rounded-full w-full'>
								Sign in
							</Button>
							<p className='text-center text-red-600 text-smin '>{message}</p>
						</form>
					</Form>

					<div className='flex flex-col items-center justify-center gap-5'>
						<p className='text-semibold text-md text-end'>
							Don't have an account?
							<a
								href='/sign-up'
								className='underline'>
								Sign up
							</a>
						</p>
					</div>
				</div>
			</main>
		</div>
	);
}
