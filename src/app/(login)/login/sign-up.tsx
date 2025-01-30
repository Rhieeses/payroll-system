export default function SignUp() {
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
				<div>hello</div>
			</main>
		</div>
	);
}
