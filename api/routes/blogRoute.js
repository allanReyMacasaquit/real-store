import express from 'express';
import {
	createBlog,
	deleteBlog,
	dislikeBlog,
	getBlogAndUpdateViews,
	getBlogs,
	likeBlog,
	updateBlogById,
} from '../controllers/BlogControllers.js';
import authMiddleware, { isAdmin } from '../middlewares/authorizedUser.js';

const blogRoute = express.Router();

blogRoute.post('/create_blog', authMiddleware, isAdmin, createBlog);
blogRoute.get('/get_blogs', authMiddleware, isAdmin, getBlogs);
blogRoute.put('/update_blog/:id', authMiddleware, isAdmin, updateBlogById);
blogRoute.put(
	'/update_views/:id',
	authMiddleware,
	isAdmin,
	getBlogAndUpdateViews
);
blogRoute.delete('/delete/:id', authMiddleware, isAdmin, deleteBlog);
blogRoute.post('/like_blog/:id', authMiddleware, isAdmin, likeBlog);
blogRoute.post('/dislike_blog/:id', authMiddleware, isAdmin, dislikeBlog);

export default blogRoute;
