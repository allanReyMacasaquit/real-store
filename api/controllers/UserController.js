import errorHandler from '../middlewares/errorhandler.js';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const createUser = async (req, res, next) => {
	const { firstname, lastname, mobile, email, password } = req.body;
	const hashedPassword = bcryptjs.hashSync(password, 10);
	const newUser = new User({
		firstname,
		lastname,
		mobile,
		email,
		password: hashedPassword,
	});

	try {
		await newUser.save();
		res.status(201).json('User created successfully!');
	} catch (error) {
		next(errorHandler('550', 'Duplicate properties'));
	}
};

export const signinUser = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		// Check if a user with the provided email exists in the database
		const user = await User.findOne({ email });

		if (!user) {
			return next(errorHandler(404, 'User not found'));
		}

		// Check if the provided password matches the user's password using bcryptjs
		const isMatch = await bcryptjs.compare(password, user.password);

		if (!isMatch) {
			return next(errorHandler(401, 'Unauthorized'));
		}

		// Create a payload for the JWT token without the password
		const tokenPayload = {
			userId: user._id,
			email: user.email,
		};

		// Create a JWT token
		const token = jwt.sign(tokenPayload, process.env.JWT_SECRET_KEY, {
			expiresIn: '1h',
		});

		// Set the token as a cookie in the response
		res.cookie('jwtToken', token, {
			httpOnly: true,
			secure: true,
			maxAge: 3600000,
			// Other cookie options can be set as needed
		});

		// Create a user object without the password field
		const userWithoutPassword = { ...user.toObject() };
		delete userWithoutPassword.password;
		// Send a success response without the password
		res.status(200).json({
			message: 'Sign-in successful',
			user: userWithoutPassword,
		});
	} catch (err) {
		return res.status(550).json({ message: 'Internal Server Error' });
	}
};
