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

export const getUsers = async (req, res, next) => {
	try {
		const getUsers = await User.find();
		//Mapping through users to remove the password field before sending the response
		const usersWithoutPasswords = getUsers.map((users) => {
			const { password, ...userWithoutPassword } = users.toObject(); // Exclude the password field
			return userWithoutPassword;
		});

		res.json({
			message: 'Successfully',
			users: usersWithoutPasswords,
		});
	} catch (error) {
		console.error(error);
		next(error);
	}
};

export const getUserById = async (req, res, next) => {
	const userId = req.params.id; // Extracting user ID from request parameters

	try {
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Exclude the password field from the user object before sending the response
		const { password, ...userWithoutPassword } = user.toObject();

		res.json({
			message: 'Successfully',
			user: userWithoutPassword,
		});
	} catch (error) {
		console.error(error);
		next(errorHandler('401', 'Unauthorized'));
	}
};

export const deleteUser = async (req, res, next) => {
	const userId = req.params.id; // Extracting user ID from request parameters

	try {
		const deletedUser = await User.findByIdAndDelete(userId);

		if (!deletedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Exclude the password field from the deleted user object before sending the response
		const { password, ...deletedUserWithoutPassword } = deletedUser.toObject();

		res.json({
			message: 'User deleted successfully',
			deletedUser: deletedUserWithoutPassword,
		});
	} catch (error) {
		console.error(error);
		next(errorHandler('401', 'Unauthorized'));
	}
};

export const updateUser = async (req, res, next) => {
	const userId = req.params.id; // Extracting user ID from request parameters
	const { email, mobile, password, firstname, lastname } = req.body; // Data to update, received from request body

	try {
		const userToUpdate = await User.findById(userId);

		if (!userToUpdate) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Update allowed fields if they exist in the request
		if (firstname) {
			userToUpdate.firstname = firstname;
		}

		if (lastname) {
			userToUpdate.lastname = lastname;
		}
		if (email) {
			userToUpdate.email = email;
		}

		if (mobile) {
			userToUpdate.mobile = mobile;
		}

		if (password) {
			// If updating password, hash the new password
			userToUpdate.password = await bcryptjs.hash(password, 10);
		}

		// Save the updated user
		const updatedUser = await userToUpdate.save();

		// Exclude sensitive fields from the updated user object before sending the response
		const { password: updatedPassword, ...updatedUserWithoutPassword } =
			updatedUser.toObject();

		res.json({
			message: 'User updated successfully',
			updatedUser: updatedUserWithoutPassword,
		});
	} catch (error) {
		console.error(error);
		next(errorHandler('401', 'Unauthorized'));
	}
};
