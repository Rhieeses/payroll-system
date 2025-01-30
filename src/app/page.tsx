'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import Link from 'next/link';
import Login from './(login)/login/page';
export default function Home() {
	return <Login />;
}

/**
 * 
 * <div className=''>
			<header className='absolute w-full h-fit'>
				<div className='flex flex-col justify-center items-center z-20 bg-white'>
					<nav className='flex flex-row  justify-between w-4/6 gap-20 p-7'>
						<div className='flex items-center gap-16'>
							<span className='flex item-center gap-1 cursor-pointer'>
								<Image
									alt='logo'
									src='/globe.svg'
									width={40}
									height={40}
								/>
								<span>
									<p className='text-lg font-bold'>Exodus</p>
									<p className='label text-sm text-start'>Systems</p>
								</span>
							</span>

							<span
								className={`flex items-center gap-1 cursor-pointer ${
									isOpen === 'products' ? 'font-bold' : ''
								}`}
								onClick={() =>
									setIsOpen((prev) => (prev === 'products' ? '' : 'products'))
								}>
								<p>Products</p>
								<i
									className={`bx ${
										isOpen === 'products' ? 'bx-chevron-down' : 'bx-chevron-up'
									}`}
								/>
							</span>
							<span
								className={`flex items-center gap-1 cursor-pointer ${
									isOpen === 'solutions' ? 'font-bold' : ''
								}`}
								onClick={() =>
									setIsOpen((prev) => (prev === 'solutions' ? '' : 'solutions'))
								}>
								<p>Solutions</p>
								<i
									className={`bx ${
										isOpen === 'solutions' ? 'bx-chevron-down' : 'bx-chevron-up'
									}`}
								/>
							</span>
							<p className='cursor-pointer'>Contact Us</p>
						</div>
						<Link href='/login'>
							<div className='flex items-center gap-5 cursor-pointer'>
								<p>Log in</p>
								<Button className='rounded-full'>Sign up</Button>
							</div>
						</Link>
					</nav>
				</div>

				{isOpen === 'products' ? (
					<div className='flex flex-col items-center justify-between border-t-[1px] border-b-[1px] bg-white'>
						<div className='w-4/6 p-7 space-y-5 pb-20'>
							<span>
								<h1 className='font-semibold'>Our suite of products</h1>
								<p className='text-sm'>
									Manage global teams and process payroll with 100% compliance
								</p>
							</span>
							<div className='grid grid-cols-2 gap-10'>
								<div className='group flex gap-3 cursor-pointer'>
									<i className='bx bx-file-find bx-sm bg-slate-200 p-3 rounded-xl component-hover'></i>
									<span>
										<h1 className='font-semibold component-hover text-lg'>
											Employer of Records
										</h1>
										<p className='text-sm'>Onboard international employees</p>
									</span>
								</div>

								<div className='group flex gap-3 cursor-pointer'>
									<i className='bx bx-hard-hat bx-sm bg-slate-200 p-3 rounded-xl component-hover' />
									<span>
										<h1 className='font-semibold component-hover text-lg'>
											Contractors
										</h1>
										<p className='text-sm'>Onboard independent contractors</p>
									</span>
								</div>

								<div className='group flex gap-3 cursor-pointer'>
									<i className='bx bx-globe bx-sm bg-slate-200 p-3 rounded-xl component-hover'></i>
									<span>
										<h1 className='font-semibold component-hover text-lg'>
											Global Payroll
										</h1>
										<p className='text-sm'>
											Manage international payroll and payments
										</p>
									</span>
								</div>

								<div className='group flex gap-3 cursor-pointer'>
									<i className='bx bx-credit-card-front bx-sm bg-slate-200 p-3 rounded-xl component-hover' />
									<span>
										<h1 className='font-semibold component-hover text-lg'>
											Immigration support
										</h1>
										<p className='text-sm'>
											Get visa support in 140+ countries
										</p>
									</span>
								</div>
							</div>
						</div>
						<div className='flex items-center justify-center w-full border-t-[1px] bg-black text-white'>
							<div className='flex gap-10 w-4/6 p-4 pl-7'>
								<span className='flex items-center gap-1'>
									<i className='bx bx-calendar-alt' />
									<p className='underline'>Book a demo</p>
								</span>
								<span className='flex items-center gap-1'>
									<i className='bx bx-envelope' />
									<p className='underline'>Contact us</p>
								</span>
							</div>
						</div>
					</div>
				) : null}

				{isOpen === 'solutions' ? (
					<div className='flex flex-col items-center justify-between border-t-[1px] border-b-[1px]  bg-white'>
						<div className='grid grid-cols-1 gap-5 w-4/6 p-7 space-y-5 pb-20'>
							<div className='flex flex-col gap-5 w-1/2 '>
								<p className='label text-sm'>BY USE CASE </p>
								<div className='grid grid-cols-2 gap-10'>
									<div className='flex gap-3'>
										<i className='bx bx-globe bx-sm pt-1' />
										<span>
											<p className='font-semibold'>Expand globally </p>

											<p className='text-sm max-w-xs'>
												Global growth made as simple as local expansion
											</p>
										</span>
									</div>

									<div className='flex gap-3'>
										<i className='bx bx-check-shield bx-sm pt-1' />
										<span>
											<p className='font-semibold'>Stay compliant</p>

											<p className='text-sm max-w-xs'>
												Ensure 100% compliance for your global team
											</p>
										</span>
									</div>
								</div>
							</div>
							<div className='flex flex-col gap-5 w-1/2 '>
								<p className='label text-sm'>BY TEAM </p>
								<div className='grid grid-cols-2 gap-10'>
									<div className='flex gap-3'>
										<i className='bx bx-group bx-sm pt-1' />
										<span>
											<p className='font-semibold'>HR Teams </p>

											<p className='text-sm max-w-xs'>
												Onboard and oversee global teams from a single
												platform
											</p>
										</span>
									</div>

									<div className='flex gap-3'>
										<i className='bx bx-check-shield bx-sm pt-1' />
										<span>
											<p className='font-semibold'>Finance teams</p>

											<p className='text-sm max-w-xs'>
												Save time and money on global admin and payroll By
												Company Size
											</p>
										</span>
									</div>
								</div>
							</div>
							<div className='flex flex-col gap-5 w-1/2 '>
								<p className='label text-sm'>BY COMPANY SIZE </p>
								<div className='grid grid-cols-2 gap-10'>
									<div className='flex gap-3'>
										<i className='bx bx-group bx-sm pt-1' />
										<span>
											<p className='font-semibold'>Startups</p>

											<p className='text-sm max-w-xs'>
												Kickstart your global employment journey
											</p>
										</span>
									</div>

									<div className='flex gap-3'>
										<i className='bx bx-check-shield bx-sm pt-1' />
										<span>
											<p className='font-semibold'>Enterprises</p>

											<p className='text-sm max-w-xs'>
												Integrate Multiplier into your ecosystem for global
												expansion
											</p>
										</span>
									</div>
								</div>
							</div>
						</div>
						<div className='flex items-center justify-center w-full border-t-[1px] bg-black text-white'>
							<div className='flex gap-10 w-4/6 p-4 pl-7'>
								<span className='flex items-center gap-1'>
									<i className='bx bx-calendar-alt' />
									<p className='underline'>Book a demo</p>
								</span>
								<span className='flex items-center gap-1'>
									<i className='bx bx-envelope' />
									<p className='underline'>Contact us</p>
								</span>
							</div>
						</div>
					</div>
				) : null}
			</header>

			<main className='w-full z-0'>
				<div className='flex flex-col items-center justify-center p-40 gap-5'>
					<h1 className='text-8xl max-w-5xl text-center'>Grow your global teams</h1>
					<p>
						Hire, manage and pay your global dream team in 150+ countries with
						Multiplier's Global Human Platform.
					</p>
				</div>
			</main>
		</div>
 */
