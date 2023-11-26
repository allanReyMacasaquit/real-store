import errorHandler from '../middlewares/errorhandler.js';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendEmail } from './MailControllers.js';

export const createUser = async (req, res, next) => {
	const { firstname, lastname, role, mobile, email, password } = req.body;

	const isValidEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	// Validate the email format before proceeding
	if (!isValidEmail(email)) {
		return res.status(400).json({ message: 'Invalid email format' });
	}
	if (!email || email.length === 0) {
		return res.status(400).json({ message: 'Email is required' });
	}

	// Check if the mobile number length is valid (must be 10 digits)
	if (!mobile || !/^\d{10}$/.test(mobile)) {
		return res
			.status(400)
			.json({ message: 'Mobile number must be 10 digits long' });
	}

	// Check if the email or mobile already exists in the database
	const existingUserWithEmail = await User.findOne({ email });
	if (existingUserWithEmail) {
		return res.status(400).json({ message: 'Email is already taken' });
	}

	// Check if there's an existing user with the provided mobile number
	const existingUserWithMobile = await User.findOne({ mobile });
	if (existingUserWithMobile) {
		return res.status(400).json({ message: 'Mobile number is already taken' });
	}

	const hashedPassword = bcryptjs.hashSync(password, 10);
	const newUser = new User({
		firstname,
		lastname,
		mobile,
		email,
		role,
		password: hashedPassword,
	});

	try {
		await newUser.save();
		res.status(201).json({ message: 'User created successfully!' });
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
			expiresIn: '1d',
		});

		// Set the token as a cookie in the response
		res.cookie('jwtToken', token, {
			httpOnly: true,
			secure: true,
			maxAge: 24 * 60 * 60 * 1000,
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
	const userId = req.params.id; // Extract the target userId from request parameters
	const { role } = req.user; // Extract the user's role from req.user

	try {
		// Check if the user has administrator or special privileges
		if (role !== 'admin') {
			return res
				.status(403)
				.json({ message: 'Unauthorized to access this user' });
		}

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}
		const { password, ...currentUser } = user.toObject();
		// Send the user's details in the response
		res.json({ currentUser });
	} catch (error) {
		console.error(error);
		next(error); // Pass the error to Express error handling middleware
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
	const { _id } = req.user; // Extracting user ID from request parameters
	const { email, mobile, password, role, firstname, lastname } = req.body; // Data to update, received from request body

	try {
		const updatedFields = {};

		// Prepare the fields to be updated if they exist in the request
		if (firstname) {
			updatedFields.firstname = firstname;
		}
		if (lastname) {
			updatedFields.lastname = lastname;
		}
		if (email) {
			updatedFields.email = email;
		}
		if (mobile) {
			updatedFields.mobile = mobile;
		}
		if (role) {
			updatedFields.role = role;
		}
		if (password) {
			// If updating password, hash the new password
			updatedFields.password = await bcryptjs.hash(password, 10);
		}
		// Check if the email or mobile already exists in the database
		const existingUserWithEmail = await User.findOne({ email });
		const existingUserWithMobile = await User.findOne({ mobile });

		if (existingUserWithEmail) {
			return res.status(400).json({ message: 'Email is already taken' });
		}

		if (existingUserWithMobile) {
			return res
				.status(400)
				.json({ message: 'Mobile number is already taken' });
		}

		const updatedUser = await User.findOneAndUpdate(
			{ _id },
			{ $set: updatedFields },
			{ new: true } // To return the updated document
		);

		if (!updatedUser) {
			return res.status(404).json({ message: 'User not found' });
		}

		// Exclude sensitive fields from the updated user object before sending the response
		const { password: updatedPassword, ...updatedUserWithoutPassword } =
			updatedUser.toObject();

		res.json({
			message: 'User updated successfully',
			updatedUser: updatedUserWithoutPassword,
		});
	} catch (error) {
		next(errorHandler('', 'Unauthorized'));
	}
};

export const updatePassword = async (req, res, next) => {
	const { _id } = req.user; // Extracting user ID from request parameters
	const { password } = req.body; // New password received from request body

	try {
		if (!password) {
			return res
				.status(400)
				.json({ message: 'Password is required for update' });
		}

		// Hash the new password
		const hashedPassword = await bcryptjs.hash(password, 10);

		// Update the user's password field
		const updatedUserPassword = await User.findOneAndUpdate(
			{ _id },
			{ password: hashedPassword },
			{ new: true } // To return the updated document
		);

		if (!updatedUserPassword) {
			return res.status(404).json({ message: 'Password not found' });
		}

		// Exclude sensitive fields from the updated user object before sending the response
		const { password: updatedPassword, ...updatedUserWithoutPassword } =
			updatedUserPassword.toObject();

		res.json({
			message: 'Password updated successfully',
			updatedUserPassword: updatedUserWithoutPassword,
		});
	} catch (error) {
		next(errorHandler('', 'Unauthorized'));
	}
};

export const blockUserAccess = async (req, res, next) => {
	const blockUser = async (userIdToBlock) => {
		try {
			const userToBlock = await User.findByIdAndUpdate(
				userIdToBlock,
				{ $set: { isBlocked: true } },
				{ new: true }
			);

			if (!userToBlock) {
				throw new Error('User not found');
			}

			return {
				success: true,
				message: 'User blocked successfully',
				user: userToBlock,
			};
		} catch (error) {
			throw new Error(error.message); // Propagate the error to the caller
		}
	};

	try {
		const _id = req.params.id;
		const blockResult = await blockUser(_id);
		res.status(200).json(blockResult);
	} catch (error) {
		next(errorHandler()); // Pass other errors to Express error handling middleware
	}
};

export const unblockUserAccess = async (req, res, next) => {
	const unblockUser = async (userIdTounBlock) => {
		try {
			const userToUpdate = await User.findByIdAndUpdate(
				userIdTounBlock,
				{ $set: { isBlocked: false } },
				{ new: true }
			);

			if (!userToUpdate) {
				throw new Error('User not found');
			}

			return {
				success: true,
				message: 'User unblocked successfully',
				user: userToUpdate,
			};
		} catch (error) {
			throw new Error(error.message); // Propagate the error to the caller
		}
	};

	try {
		const _id = req.params.id;
		const unblockResult = await unblockUser(_id);
		res.status(200).json(unblockResult);
	} catch (error) {
		next(errorHandler('401', 'Unauthorized User')); // Pass other errors to Express error handling middleware
	}
};

export const handleRefreshToken = async (req, res) => {
	const refreshToken = req.cookies.jwtToken;

	if (!refreshToken) {
		console.log('No Token found');
		return; // Exit function or send appropriate response
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
		const user = await User.findOne({ _id: decoded.userId });

		if (!user) {
			return next(new Error('Invalid Credentials'));
		}
		const accessToken = jwt.sign('refreshToken', process.env.JWT_SECRET_KEY);
		res.json({ accessToken });
		// Further operations with the user...
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
};

export const Logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.jwtToken;

		if (!refreshToken) {
			console.log('No Token found');
			return res.status(401).send('No Token found');
		}

		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);

		const user = await User.findById(decoded.userId);
		if (!user) {
			res.clearCookie('jwtToken', {
				httpOnly: true,
				secure: true,
			});
			return res.status(403).send('Forbidden');
		}

		// Assuming refreshToken is a field in the User model that needs updating
		await User.findByIdAndUpdate(decoded.userId, {
			jwtToken: '',
		});

		res.clearCookie('jwtToken', {
			httpOnly: true,
			secure: true,
		});
		res.clearCookie('accessToken', {
			httpOnly: true,
			secure: true,
		});

		return res.status(204).send('Logout successful');
	} catch (error) {
		console.log(error);
		return res.status(500).send('Internal Server Error');
	}
};

export const forgotPasswordToken = async (req, res) => {
	try {
		const { email } = req.body;

		// Find the user by email
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).json({ message: 'User not found.' });
		}

		// Generate a password reset token
		const token = await user.generatePasswordResetToken();
		console.log(token);
		await user.save(); // Save the updated user document

		// Send the token to the user's email for password reset
		const data = {
			to: email,
			subject: 'Forgot Password',
			text: `Link to reset your password. <a href="http://localhost:5000/api/user/reset_password/${token}">Click here!</a>`,
		};

		sendEmail(data);
		return res
			.status(200)
			.json({ message: 'Password reset token generated successfully.', token });
	} catch (error) {
		console.error('Error generating password reset token:', error);
		return res.status(500).json({ message: 'Internal server error.' });
	}
};

export const resetPasswordToken = async (req, res) => {
	try {
		const token = req.params.token;
		const newPassword = req.body.password; // Assuming the new password is sent in the request body
		const resetToken = crypto.createHash('sha256').update(token).digest('hex');
		// Find the user by the received token and check if it's valid
		const user = await User.findOne({
			resetPasswordToken: resetToken,
			resetPasswordExpires: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ message: 'Invalid or expired token.' });
		}

		// Hash the new password
		const hashedPassword = await bcryptjs.hash(newPassword, 10);

		// Update the user's password and clear reset token fields
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpires = undefined;

		await user.save(); // Save the updated user document

		// Respond with success message
		return res
			.status(200)
			.json({ message: 'Password reset successful.', user });
	} catch (error) {
		console.error('Error resetting password:', error);
		res.status(500).json({ message: 'Internal server error.' });
	}
};
