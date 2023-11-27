import express from 'express';
import {
	createBlogCategory,
	deleteBlogCategory,
	getBlogCategories,
	getBlogCategory,
	updateBlogCategory,
} from '../controllers/BlogCategoryControllers.js';
import authMiddleware, { isAdmin } from '../middlewares/authorizedUser.js';

const blogCategoryRoute = express.Router();

blogCategoryRoute.post(
	'/createBlogCategory',
	authMiddleware,
	isAdmin,
	createBlogCategory
);
blogCategoryRoute.put(
	'/updateBlogCategory/:id',
	authMiddleware,
	isAdmin,
	updateBlogCategory
);
blogCategoryRoute.delete(
	'/deleteBlogCategory/:id',
	authMiddleware,
	isAdmin,
	deleteBlogCategory
);
blogCategoryRoute.get('/getBlogCategories', getBlogCategories);
blogCategoryRoute.get('/getBlogCategory/:id', getBlogCategory);

export default blogCategoryRoute;
