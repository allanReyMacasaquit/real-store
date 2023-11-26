import Blog from '../models/Blog.js';

export async function createBlog(req, res) {
	try {
		const {
			title,
			description,
			category,
			author,
			tags = [],
			image = '',
			numViews,
			isLiked,
			isDisliked,
			comments = [],
		} = req.body;

		const newBlog = await Blog.create({
			title,
			description,
			category,
			author,
			tags,
			image,
			numViews,
			isLiked,
			isDisliked,
			comments,
		});

		res.json(newBlog);
	} catch (error) {
		console.error('Error creating blog:', error);
		res.status(500).json({ error: 'Failed to create the blog post.' });
	}
}

export async function getBlogs(req, res) {
	try {
		const allBlogs = await Blog.find();

		res.json(allBlogs);
	} catch (error) {
		console.error('Error fetching blogs:', error);
		res.status(500).json({ error: 'Failed to fetch blog posts.' });
	}
}

export async function updateBlogById(req, res) {
	try {
		const blogId = req.params.id;
		const {
			title,
			description,
			category,
			author,
			tags,
			image,
			numViews,
			isLiked,
			isDisliked,
		} = req.body;

		const updatedBlog = await Blog.findByIdAndUpdate(
			blogId,
			{
				title,
				description,
				category,
				author,
				tags,
				image,
				numViews,
				isLiked,
				isDisliked,
			},
			{ new: true }
		);

		if (!updatedBlog) {
			return res.status(404).json({ error: 'Blog not found.' });
		}

		res.json(updatedBlog);
	} catch (error) {
		console.error('Error updating blog by ID:', error);
		res.status(500).json({ error: 'Failed to update the blog post.' });
	}
}

export async function getBlogAndUpdateViews(req, res) {
	try {
		const blogId = req.params.id; // Assuming the ID is passed as a route parameter

		// Fetch the blog by ID
		const blog = await Blog.findById(blogId)
			.populate('likes')
			.populate('dislikes');

		if (!blog) {
			return res.status(404).json({ error: 'Blog not found.' });
		}

		// Increment the numViews field by 1
		blog.numViews += 1;
		await blog.save(); // Save the updated blog

		res.json(blog); // Return the updated blog
	} catch (error) {
		console.error('Error updating numViews:', error);
		res.status(500).json({ error: 'Failed to update numViews.' });
	}
}

export async function deleteBlog(req, res, next) {
	try {
		const productId = req.params.id;

		const deletedBlog = await Blog.findByIdAndDelete(productId);

		if (!deletedBlog) {
			return res.status(404).json({ message: 'Blog not found' });
		}

		res.json({
			message: 'Product deleted successfully',
			deletedProduct,
		});
	} catch (error) {
		next(error);
	}
}

export async function likeBlog(req, res) {
	try {
		const { id: blogId } = req.params;
		const { id: loginUserId } = req.user;

		const blog = await Blog.findById(blogId);

		if (!blog) {
			return res.status(404).json({ error: 'Blog not found.' });
		}

		const alreadyLiked = blog.likes.includes(loginUserId);
		const alreadyDisliked = blog.dislikes.includes(loginUserId);
		let update = {};

		if (alreadyDisliked) {
			update = { $pull: { dislikes: loginUserId }, isDisliked: false };
			await Blog.findByIdAndUpdate(blogId, update);
			return res.json({
				message: 'Dislike removed.',
				updatedBlog: await Blog.findById(blogId),
			});
		}

		if (alreadyLiked) {
			update = { $pull: { likes: loginUserId }, isLiked: false };
			await Blog.findByIdAndUpdate(blogId, update);
			return res.json({
				message: 'Like removed.',
				updatedBlog: await Blog.findById(blogId),
			});
		}

		update = { $push: { likes: loginUserId }, isLiked: true };
		await Blog.findByIdAndUpdate(blogId, update);
		res.json({ message: 'Liked.', updatedBlog: await Blog.findById(blogId) });
	} catch (error) {
		console.error('Error liking blog:', error);
		res.status(500).json({ error: 'Failed to like the blog post.' });
	}
}

export async function dislikeBlog(req, res) {
	try {
		const { id: blogId } = req.params;
		const { id: loginUserId } = req.user;

		const blog = await Blog.findById(blogId);

		if (!blog) {
			return res.status(404).json({ error: 'Blog not found.' });
		}

		const alreadyLiked = blog.likes.includes(loginUserId);
		const alreadyDisliked = blog.dislikes.includes(loginUserId);
		let update = {};

		if (alreadyLiked) {
			update = { $pull: { likes: loginUserId }, isLiked: false };
			await Blog.findByIdAndUpdate(blogId, update);
			return res.json({
				message: 'Like removed.',
				updatedBlog: await Blog.findById(blogId),
			});
		}

		if (alreadyDisliked) {
			update = { $pull: { dislikes: loginUserId }, isDisliked: false };
			await Blog.findByIdAndUpdate(blogId, update);
			return res.json({
				message: 'Dislike removed.',
				updatedBlog: await Blog.findById(blogId),
			});
		}

		update = { $push: { dislikes: loginUserId }, isDisliked: true };
		await Blog.findByIdAndUpdate(blogId, update);
		res.json({
			message: 'Disliked.',
			updatedBlog: await Blog.findById(blogId),
		});
	} catch (error) {
		console.error('Error disliking blog:', error);
		res.status(500).json({ error: 'Failed to dislike the blog post.' });
	}
}
