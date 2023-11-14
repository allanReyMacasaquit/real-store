import errorHandler from '../middlewares/errorhandler.js';
import bcryptjs from 'bcryptjs';
import User from '../models/user.js';

const createUser = async (req, res, next) => {
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

export default createUser;
