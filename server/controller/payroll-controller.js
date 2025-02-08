const { verifyToken } = require('../config/auth');

const payrollModel = require('../model/payroll-model');

const PayrollList = async (req, res) => {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ message: 'Unauthorized, You must login first!' });
	}

	try {
		const { start, end } = req.query;

		verifyToken(token, ['Admin', 'User']);
		const payrollList = await payrollModel.fetchPayrollList(start, end);
		res.json(payrollList);
	} catch (error) {
		res.status(500).json({ error: 'Error fetching payroll list' });
	}
};

module.exports = { PayrollList };
