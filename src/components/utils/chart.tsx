'use client';

import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
	ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from '@/components/ui/chart';

const chartData = [
	{ month: 'January', desktop: 186, mobile: 80 },
	{ month: 'February', desktop: 305, mobile: 200 },
	{ month: 'March', desktop: 237, mobile: 120 },
	{ month: 'April', desktop: 73, mobile: 190 },
	{ month: 'May', desktop: 209, mobile: 130 },
	{ month: 'June', desktop: 214, mobile: 140 },
	{ month: 'July', desktop: 237, mobile: 120 },
	{ month: 'August', desktop: 186, mobile: 80 },
	{ month: 'September', desktop: 305, mobile: 200 },
	{ month: 'October', desktop: 73, mobile: 190 },
	{ month: 'November', desktop: 214, mobile: 140 },
	{ month: 'December', desktop: 237, mobile: 120 },
];

const chartConfig = {
	desktop: {
		label: 'Desktop',
		color: '#2563eb',
	},
	mobile: {
		label: 'Mobile',
		color: '#60a5fa',
	},
} satisfies ChartConfig;

export function Chart() {
	return (
		<ChartContainer
			className='h-[30rem] w-full'
			config={chartConfig}>
			<BarChart
				accessibilityLayer
				data={chartData}>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey='month'
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
				/>
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<Bar
					dataKey='desktop'
					fill='var(--color-desktop)'
					radius={4}
				/>
				<Bar
					dataKey='mobile'
					fill='var(--color-mobile)'
					radius={4}
				/>
			</BarChart>
		</ChartContainer>
	);
}
