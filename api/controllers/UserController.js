import errorHandler from '../middlewares/errorhandler.js';
import User from '../models/user.js';

const createUser = async (req, res, next) => {
	try {
		const findUser = await User.findOne({ email: req.body.email });

		if (!findUser) {
			const newUser = await User.create(req.body);
			res.status(201).json(newUser);
		} else {
			res.status(409).json({
				message: 'User with this email already exists',
				success: false,
			});
		}
	} catch (error) {
		next(errorHandler);
	}
};

export default createUser;
