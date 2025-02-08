import { Button } from '@/components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { TimeInput } from '@nextui-org/date-input';

interface ModalProps {
	children: React.ReactElement;
}

export function Modal({ children }: ModalProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{children}</DialogTrigger>
			<DialogContent className='sm:max-w-1/2'>
				<DialogHeader>
					<DialogTitle>Set status</DialogTitle>
					<DialogDescription>
						Set status including time in and time out to multiple employees here. Click
						save when you're done.
					</DialogDescription>
				</DialogHeader>
				<div className='grid grid-cols-2 gap-5'>
					<div className='col-span-2'>
						<Select>
							<SelectTrigger className='w-full border-[1px] rounded-lg border-gray-500 p-5'>
								<SelectValue placeholder='Status' />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value='absent'>
										<p className='text-red-500'>Absent</p>
									</SelectItem>
									<SelectItem value='present'>
										<p className='text-green-500'>Present</p>
									</SelectItem>
									<SelectItem value='late'>
										<p className='text-orange-500'>Late</p>
									</SelectItem>
									<SelectItem value='leave'>
										<p className='text-blue-700'>Leave</p>
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<TimeInput
						classNames={{
							inputWrapper: 'border-[1px] rounded-lg border-gray-500',
						}}
						isRequired
						hourCycle={12}
						color='primary'
						variant='bordered'
						label='Time in'
					/>

					<TimeInput
						classNames={{
							inputWrapper: 'border-[1px] rounded-lg border-gray-500',
						}}
						isRequired
						hourCycle={12}
						color='primary'
						variant='bordered'
						label='Time out'
					/>
				</div>

				<DialogFooter>
					<Button type='submit'>Save changes</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
