'use client';
import Layout from '@/components/custom-ui/layout';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Chart } from '@/components/utils/chart';

export default function Dashboard() {
	return (
		<Layout>
			<>
				<section className='flex items-center justify-between top-section'>
					<DropdownMenu>
						<DropdownMenuTrigger>
							<span className='flex items-center gap-1 light-border label p-2 rounded-lg shadow-sm'>
								<p className='text-sm'>28 August - 28 September 2024</p>
								<i className='bx bx-chevron-down bx-xs'></i>
							</span>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>My Account</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Profile</DropdownMenuItem>
							<DropdownMenuItem>Billing</DropdownMenuItem>
							<DropdownMenuItem>Team</DropdownMenuItem>
							<DropdownMenuItem>Subscription</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>

					<Button className='p-5 rounded-lg shadow-none hover:bg-black hover:text-white duration-300'>
						<i className='bx bx-plus bx-sm '></i>
						New Payroll
					</Button>
				</section>

				<div className='alert flex items-center justify-between border-[1px] border-blue-300 bg-blue-100 p-2 rounded-xl'>
					<span className='flex gap-2'>
						<i className='bx bx-alarm-exclamation bx-tada bx-sm text-blue-500'></i>
						<p className='font-medium'>
							Payroll submissions are due in 2 days. Kindly review and finalize all
							payroll details for employees within the given time frame.
						</p>
					</span>

					<span className='flex items-center gap-2'>
						<p className='font-semibold underline'>More details</p>
						<i className='bx bx-x bx-sm'></i>
					</span>
				</div>

				<div className='grid grid-cols-4 gap-5'>
					<div className='light-border rounded-xl bg-slate-100'>
						<div className='p-3 font-medium text-lg'>
							<p>Payrolls Cost</p>
						</div>
						<div className='p-3'>
							<h1>₱ 240,000</h1>
							<div className='flex gap-2 items-center '>
								<span className='flex text-green-500'>
									<i className='bx bx-up-arrow-alt bx-sm'></i>
									<p className='text-green-500'></p>13%
								</span>
								<p className='label'>From last month</p>
							</div>
						</div>
					</div>
					{''}
					<div className='light-border rounded-xl bg-slate-100'>
						<div className='p-3 font-medium text-lg'>
							<p>Total Expense</p>
						</div>
						<div className='p-3'>
							<h1>₱ 140,000</h1>
							<div className='flex gap-2 items-center '>
								<span className='flex text-green-500'>
									<i className='bx bx-up-arrow-alt bx-sm'></i>
									<p className='text-green-500'></p>16%
								</span>
								<p className='label'>From last month</p>
							</div>
						</div>
					</div>
					{''}
					<div className='light-border rounded-xl bg-slate-100'>
						<div className='p-3 font-medium text-lg'>
							<p>Pending Payments</p>
						</div>
						<div className='p-3'>
							<h1>₱ 50,000</h1>
							<div className='flex gap-2 items-center '>
								<span className='flex text-green-500'>
									<i className='bx bx-up-arrow-alt bx-sm'></i>
									<p className='text-green-500'></p>13%
								</span>
								<p className='label'>From last month</p>
							</div>
						</div>
					</div>
					{''}
					<div className='light-border rounded-xl bg-slate-100'>
						<div className='p-3 font-medium text-lg'>
							<p>Total Payroll</p>
						</div>
						<div className='p-3'>
							<h1>450</h1>
							<div className='flex gap-2 items-center '>
								<span className='flex text-red-500'>
									<i className='bx bx-down-arrow-alt bx-sm'></i>
									<p className='text-green-500'></p>20%
								</span>
								<p className='label'>From last month</p>
							</div>
						</div>
					</div>

					<div className='chart col-span-4 border-[1px] border-gray-200 rounded-lg'>
						<div className='flex items-center justify-between p-3'>
							<p className='p-3 font-medium text-lg'>Total Payrolls</p>
							<Tabs defaultValue='duration'>
								<TabsList>
									<TabsTrigger value='Day'>Day</TabsTrigger>
									<TabsTrigger value='Week'>Week</TabsTrigger>
									<TabsTrigger value='Month'>Month</TabsTrigger>
								</TabsList>
								<TabsContent value='Day' />
								<TabsContent value='Week' />
								<TabsContent value='Month' />
							</Tabs>
						</div>

						<Chart />
					</div>
				</div>
			</>
		</Layout>
	);
}

/**
 * 	<span className='flex items-center gap-2'>
							<i className='bx bx-user bx-sm' />
							<p className='text-lg font-semibold'>Employees</p>
						</span>
						<span className='flex flex-col items-'>
							<strong className='text-2xl'>128</strong>
							<p className='label'>active employees</p>
						</span>
 */
