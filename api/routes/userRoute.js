import express from 'express';
import {
	Logout,
	blockUserAccess,
	createUser,
	deleteUser,
	forgotPasswordToken,
	getUserById,
	getUsers,
	handleRefreshToken,
	resetPasswordToken,
	signinUser,
	unblockUserAccess,
	updatePassword,
	updateUser,
} from '../controllers/UserController.js';
import authMiddleware, { isAdmin } from '../middlewares/authorizedUser.js';

const userRoute = express.Router();

userRoute.post('/register', createUser);
userRoute.post('/signin', signinUser);
userRoute.get('/refresh', handleRefreshToken);
userRoute.get('/logout', Logout);
userRoute.put('/update_password', authMiddleware, updatePassword);
userRoute.put('/reset_password/:token', resetPasswordToken);
userRoute.post('/forgot_password_token', forgotPasswordToken);
userRoute.get('/get_users', authMiddleware, getUsers);
userRoute.get('/get_user/:id', authMiddleware, isAdmin, getUserById);
userRoute.delete('/delete_user/:id', authMiddleware, isAdmin, deleteUser);
userRoute.put('/update_user/:id', authMiddleware, isAdmin, updateUser);
userRoute.put('/block_user/:id', authMiddleware, isAdmin, blockUserAccess);
userRoute.put('/unblock_user/:id', authMiddleware, isAdmin, unblockUserAccess);

export default userRoute;
