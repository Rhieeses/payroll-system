import { AttendanceSchema } from '../../attendance/components/columns';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type PayModalProps = {
	employeeData: AttendanceSchema;
	onClose: () => void;
};

export const PayModal = ({ employeeData, onClose }: PayModalProps) => {
	if (!employeeData) return null;

	console.log(employeeData);

	return (
		<Dialog
			open={!!employeeData}
			onOpenChange={onClose}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>Pay Employee</DialogTitle>
					<DialogDescription>Verify employee hours and deductions.</DialogDescription>
				</DialogHeader>
				<div className='grid gap-4 py-4'>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label
							htmlFor='name'
							className='text-right'>
							Name
						</Label>
						<Input
							id='name'
							value='Pedro Duarte'
							className='col-span-3'
							readOnly
						/>
					</div>
					<div className='grid grid-cols-4 items-center gap-4'>
						<Label
							htmlFor='username'
							className='text-right'>
							Username
						</Label>
						<Input
							id='username'
							value='@peduarte'
							className='col-span-3'
							readOnly
						/>
					</div>
				</div>
				<DialogFooter>
					<Button type='submit'>Pay Employee</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
