'use client';

export const TimeToday: any = () => {
	const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	const d = new Date();
	let hours = d.getHours();
	let minutes: any = d.getMinutes();
	const amPm = hours >= 12 ? 'PM' : 'AM';

	hours = hours % 12 || 12;

	minutes = minutes.toString().padStart(2, '0');

	const time = `${hours}:${minutes} ${amPm}`;
	let date = d.getDate();
	let day = weekday[d.getDay()];
	let month = months[d.getMonth()];
	let year = d.getFullYear();

	return `${day}, ${month} ${date}, ${year} ${time}`;
};
