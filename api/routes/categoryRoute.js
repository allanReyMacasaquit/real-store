import express from 'express';
import {
	createCategory,
	deleteCategory,
	getCategories,
	getCategory,
	updateCategory,
} from '../controllers/CategoryControllers.js';
import authMiddleware, { isAdmin } from '../middlewares/authorizedUser.js';

const categoryRoute = express.Router();

categoryRoute.post('/create_category', authMiddleware, isAdmin, createCategory);
categoryRoute.put(
	'/update_category/:id',
	authMiddleware,
	isAdmin,
	updateCategory
);
categoryRoute.delete(
	'/delete_category/:id',
	authMiddleware,
	isAdmin,
	deleteCategory
);
categoryRoute.get('/get_categories', getCategories);
categoryRoute.get('/get_category/:id', getCategory);

export default categoryRoute;
