import express from 'express';
import { createUser, signinUser } from '../controllers/UserController.js';

const userRoute = express.Router();

userRoute.post('/register', createUser);

userRoute.post('/signin', signinUser);

export default userRoute;
