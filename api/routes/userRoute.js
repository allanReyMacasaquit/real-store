import express from 'express';
import createUser from '../controllers/UserController.js';

const userRoute = express.Router();

userRoute.post('/register', createUser);

export default userRoute;
