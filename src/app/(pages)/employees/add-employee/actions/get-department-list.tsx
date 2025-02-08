import axios from 'axios';

/**
 * export const useDepartmentList = () => {
	const [department, setDepartment] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchDepartmentChoice = async () => {
			try {
				const response = await axios.get('/api/department/department-choices', {
					withCredentials: true,
				});
				setDepartment(response.data);
			} catch (error) {
				console.error('Error fetching choices:', error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchDepartmentChoice();
	}, []);

	return { department, isLoading };
};
 * 
 * 
 */

export async function getDepartmentList() {
	try {
		const response = await axios.get('/api/department/department-choices', {
			withCredentials: true,
		});
		const department = await response.data;

		return { department: department };
	} catch (error) {
		console.error('Error fetching choices:', error);
		return { department: [] };
	}
}
