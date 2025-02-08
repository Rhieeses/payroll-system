'use client';
import { useRouter } from 'next/navigation';

type Props = {
	children: string;
};

export default function BackButton({ children }: Props) {
	const router = useRouter();

	return (
		<div
			onClick={() => router.back()}
			className='header flex items-center gap-2 p-3'>
			<i className='bx bx-arrow-back bx-sm cursor-pointer hover:text-gray-300' />
			<span>{children}</span>
		</div>
	);
}
