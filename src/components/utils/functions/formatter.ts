export const formatSalary = (value: string) => {
	const numberValue = parseFloat(value.replace(/[^0-9-]+/g, ''));
	if (isNaN(numberValue)) return '';
	return `₱ ${numberValue.toLocaleString()}`;
};

export const formatNumber = (value: number) => {
	if (isNaN(value) || value === undefined || value === null) return '';
	return `₱ ${value.toLocaleString()}`;
};

export const cleanInput = (value: any): any => {
	const cleanedValue = value.replace(/[^0-9.]+/g, '');

	const parts = cleanedValue.split('.');
	if (parts.length > 2) {
		return parts[0] + '.' + parts.slice(1).join('');
	}

	return parseFloat(cleanedValue);
};

export const formatDate = (dateString: string) => {
	const date = new Date(dateString);
	const monthNames = [
		'Jan.',
		'Feb.',
		'Mar.',
		'Apr.',
		'May',
		'Jun',
		'Jul',
		'Aug.',
		'Sept.',
		'Oct',
		'Nov.',
		'Dec.',
	];
	const day = date.getDate();
	const month = monthNames[date.getMonth()];
	const year = date.getFullYear();
	return `${month} ${day}, ${year}`;
};

export const formatDateToTime = (dateString: string): string => {
	const date = new Date(dateString);

	const options: Intl.DateTimeFormatOptions = {
		hour: '2-digit',
		minute: '2-digit',
		hour12: true,
	};

	// Format the time
	const time = date.toLocaleString('en-SG', options); // Example: "8:00 AM"

	return time;
};
