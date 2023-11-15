import express from 'express';
import {
	createUser,
	deleteUser,
	getUserById,
	getUsers,
	signinUser,
	updateUser,
} from '../controllers/UserController.js';

const userRoute = express.Router();

userRoute.post('/register', createUser);
userRoute.post('/signin', signinUser);
userRoute.get('/get_users', getUsers);
userRoute.get('/get_user/:id', getUserById);
userRoute.delete('/delete_user/:id', deleteUser);
userRoute.post('/update_user/:id', updateUser);

export default userRoute;
