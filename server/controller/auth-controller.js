const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET;
const connection = require('../config/db');

const Login = async (req, res) => {
	const { username, password } = req.body;

	try {
		const result = await connection.query('SELECT * FROM users WHERE username = $1', [
			username,
		]);
		const user = result.rows[0];

		if (!user) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(401).json({ message: 'Invalid credentials' });
		}

		const payload = {
			userId: user.id,
			username: user.username,
			name: user.name,
			position: user.position,
		};
		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '5h' });

		res.cookie('token', token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: 5 * 60 * 60 * 1000,
			sameSite: 'strict',
		});

		res.status(200).json({ message: 'Login successful!', user: payload, token });
	} catch (error) {
		console.error('Error during login:', error);
		res.status(500).json({ message: 'Server error' });
	}
};

const SignUp = async (req, res) => {
	try {
	} catch (error) {}
};

module.exports = { Login, SignUp };
