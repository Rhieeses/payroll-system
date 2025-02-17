import { Button } from '@/components/ui/button';
import { logout } from '@/actions/logout';

export default function LogoutButton() {
	const handleLogout = async () => {
		await logout();
		window.location.reload();
	};

	return (
		<Button
			onClick={handleLogout}
			variant='outline'
			className='p-5 shadow-none hover:bg-red-500  hover:text-white duration-300'>
			<i className='bx bx-log-out bx-sm'></i>
			Logout
		</Button>
	);
}
