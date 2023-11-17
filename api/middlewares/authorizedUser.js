import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import errorHandler from './errorhandler.js';

const authMiddleware = async (req, res, next) => {
	try {
		const token = req.header('Authorization'); // Extract the token from the request header

		if (!token) {
			return res.status(401).json({ message: 'Authorization token not found' });
		}

		// Verify the token using the JWT_SECRET_KEY
		const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

		// Fetch the user based on the decoded token information (e.g., user ID)
		const user = await User.findById(decoded.userId);
		if (!user) {
			return next(errorHandler('401', 'Invalid Credentials'));
		}

		// Attach the user object to the request for further use in the routes
		req.user = user;

		next(); // Call the next middleware or route handler
	} catch (error) {
		console.error(error);
		return res.status(401).json({ message: 'Invalid token' });
	}
};
export const isAdmin = async (req, res, next) => {
	try {
		// Access the authenticated user from the req object
		const user = req.user;

		if (!user) {
			throw new Error('User not found in the request');
		}

		// Check if the user has the role of an admin
		if (user.role !== 'admin') {
			return res
				.status(403)
				.json({ message: 'Access forbidden. Admins only.' });
		}

		next();
		// Exclude the password field from the deleted user object before sending the response
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: 'Internal server error' });
	}
};

export default authMiddleware;
