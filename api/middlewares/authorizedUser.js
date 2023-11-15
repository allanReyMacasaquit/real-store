import jwt from 'jsonwebtoken';
import User from '../models/user.js';

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
			return res.status(401).json({ message: 'Invalid token' });
		}

		// Attach the user object to the request for further use in the routes
		req.user = user;
		next(); // Call the next middleware or route handler
	} catch (error) {
		console.error(error);
		return res.status(401).json({ message: 'Invalid token' });
	}
};
export default authMiddleware;
