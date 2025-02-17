'use client';

import { useState } from 'react';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export const TerminateEmployee = (empId: any) => {
	const [open, setOpen] = useState<boolean>(false);
	const [message, setMessage] = useState<string>('');

	const handleTerminate = async () => {
		try {
			const response = await axios.delete('/api/employee/terminate-employee', {
				withCredentials: true,
				params: {
					id: empId,
				},
			});

			if (response.status === 200) {
				setMessage('Employee terminated!');

				setTimeout(() => {
					setOpen(false);
				}, 3000);
			}
		} catch (error) {
			console.error('Error', error);
			console.log('There have been a problem deleting this employee', error);
			setMessage('There was an issue terminating the employee.');
		}
	};

	return (
		<>
			<Dialog
				open={open}
				onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant='destructive'>Terminate</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Are you absolutely sure?</DialogTitle>
						<DialogDescription>
							{!message ? (
								<>
									This action cannot be undone. This will permanently terminate
									this employee and remove the data from the database.
								</>
							) : (
								message
							)}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							onClick={() => setOpen(false)}
							variant='outline'>
							Cancel
						</Button>
						<Button
							onClick={handleTerminate}
							variant='destructive'>
							Confirm
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
};
