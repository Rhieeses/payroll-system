'use client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from './logout-button';

const Layout = ({ children }: { children: React.ReactNode }) => {
	const pathname = usePathname();

	const pageTitle = pathname.split('/').slice(0, 2).join(' ');
	return (
		<>
			<aside className='fixed bg-white w-[14%] h-full space-y-5 overflow-auto'>
				<section className='flex flex-col gap-5 p-5'>
					<div className='flex items-center gap-5 p-3 w-full h-fit bg-white light-border rounded-md shadow-sm'>
						<img
							src='/next.svg'
							alt='logo'
							className='w-[2.5rem] h-[2.5rem]'
						/>
						<h2 className='font-semibold'>TalentTrack</h2>
					</div>

					<div>
						<span className='flex items-center'>
							<i className='bx bx-search bx-sm absolute pl-2 text-gray-500' />
							<Input
								className='p-5 pl-9 capitalize rounded-lg shadow-sm'
								placeholder='Search.'
							/>
						</span>
					</div>
				</section>
				<section className='border-b-[1px]'>
					<div className='p-5 pt-0'>
						<p className='label text-xs mb-[0.2rem]'>MAIN MENU</p>
						<ul className='flex flex-col gap-2 '>
							<Link
								href='/dashboard'
								className={`p-[0.5rem] rounded-lg ${
									pathname === '/dashboard'
										? 'bg-black/10 text-slate-900'
										: 'cursor-pointer hover:bg-gray-200 duration-200'
								}`}>
								<li className='flex gap-2 w-full'>
									<i className='bx bx-category-alt bx-sm' />
									<p>Dashboard</p>
								</li>
							</Link>

							<Link
								href='/departments'
								className={`p-[0.5rem] rounded-lg  ${
									pathname === '/departments'
										? 'bg-black/10 text-slate-900'
										: 'cursor-pointer hover:bg-gray-200 duration-200'
								}`}>
								<li className='flex gap-2 w-full'>
									<i className='bx bx-sitemap bx-sm' />
									<p>Department</p>
								</li>
							</Link>

							<Link
								href='/employees'
								className={`p-[0.5rem] rounded-lg  ${
									pathname === '/employees' ||
									pathname === '/employees/add-employee'
										? 'bg-black/10 text-slate-900'
										: 'cursor-pointer hover:bg-gray-200 duration-200'
								}`}>
								<li className='flex gap-2 w-full'>
									<i className='bx bx-user-voice bx-sm' />
									<p>Employees</p>
								</li>
							</Link>

							<Link
								href='/attendance'
								className={`p-[0.5rem] rounded-lg  ${
									pathname === '/attendance'
										? 'bg-black/10 text-slate-900'
										: 'cursor-pointer hover:bg-gray-200 duration-200'
								}`}>
								<li className='flex gap-2 w-full'>
									<i className='bx bx-user-check bx-sm' />
									<p>Attendance</p>
								</li>
							</Link>

							<Link
								href='/payroll'
								className={`p-[0.5rem] rounded-lg  ${
									pathname === '/payroll'
										? 'bg-black/10 text-slate-900'
										: 'cursor-pointer hover:bg-gray-200 duration-200'
								}`}>
								<li className='flex gap-2 w-full'>
									<i className='bx bx-dollar-circle bx-sm' />
									<p>Payroll</p>
								</li>
							</Link>
						</ul>
					</div>
				</section>

				<section className='border-b-[1px]'>
					<div className='p-5 pt-0'>
						<p className='label text-xs mb-[0.2rem]'>TEAM MANAGEMENT</p>
						<ul className='flex flex-col gap-2 '>
							<Link
								href='/invoices'
								className={`p-[0.5rem] rounded-lg  ${
									pathname === '/invoices'
										? 'bg-black/10 text-slate-900'
										: 'cursor-pointer hover:bg-gray-200 duration-200'
								}`}>
								<li className='flex gap-2 w-full'>
									<i className='bx bx-receipt bx-sm' />
									<p>Invoices</p>
								</li>
							</Link>

							<Link
								href='/settings'
								className={`p-[0.5rem] rounded-lg  ${
									pathname === '/settings'
										? 'bg-black/10 text-slate-900'
										: 'cursor-pointer hover:bg-gray-200 duration-200'
								}`}>
								<li className='flex gap-2 w-full'>
									<i className='bx bx-cog bx-sm' />
									<p>Settings</p>
								</li>
							</Link>
							<Link
								href='/help'
								className={`p-[0.5rem] rounded-lg  ${
									pathname === '/help'
										? 'bg-black/10 text-slate-900'
										: 'cursor-pointer hover:bg-gray-200 duration-200'
								}`}>
								<li className='flex gap-2 w-full'>
									<i className='bx bx-help-circle bx-sm' />
									<p>Help Center</p>
								</li>
							</Link>
						</ul>
					</div>
				</section>
			</aside>
			<main className='ml-[17rem]'>
				<div className='light-border rounded-xl bg-white shadow-sm w-full h-full flex flex-col'>
					<div className='header flex items-center justify-between p-5 border-b-[1px] border-gray-300'>
						<h1 className='text-2xl font-semibold tracking-wide capitalize'>
							{pageTitle}
						</h1>
						<div className='space-x-2'>
							<i className='bx bx-message-square-dots bx-sm light-border rounded-lg p-2'></i>
							<i className='bx bx-bell bx-sm light-border rounded-lg p-2'></i>
							<Button
								variant='outline'
								className='p-5 shadow-none hover:bg-black hover:text-white duration-300'>
								<i className='bx bx-user-plus bx-sm'></i>
								Invite
							</Button>
							<LogoutButton />
						</div>
					</div>
					<div className='body p-5 space-y-5'>{children}</div>
				</div>
			</main>
		</>
	);
};

export default Layout;
