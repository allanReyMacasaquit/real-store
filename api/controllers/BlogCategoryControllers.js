import blogCategory from '../models/BlogCategory.js';

export async function createBlogCategory(req, res) {
	try {
		const { title } = req.body;
		const blog = await blogCategory.create({ title });
		res.json({ message: 'New Brand has created!', blog });
	} catch (error) {
		console.error(error);
		console.log('Server error');
	}
}

export async function updateBlogCategory(req, res) {
	try {
		const { id: blogId } = req.params;

		const blog = await blogCategory.findByIdAndUpdate(blogId, req.body, {
			new: true,
		});

		if (!blog) {
			return res.status(404).json({ error: 'blog not found.' });
		}

		res.json(blog);
	} catch (error) {
		console.error('Error creating blog:', error.message);
		throw new Error('Could not create blog.');
	}
}

export async function getBlogCategories(req, res) {
	try {
		const blog = await blogCategory.find();

		if (!blog) {
			return res.status(404).json({ error: 'blog not found.' });
		}

		res.json(blog);
	} catch (error) {
		console.error('Error creating blog:', error.message);
		throw new Error('Could not create blog.');
	}
}
export async function getBlogCategory(req, res) {
	try {
		const { id: blogId } = req.params;

		const blog = await blogCategory.findById(blogId);

		if (!blog) {
			return res.status(404).json({ error: 'blog not found.' });
		}

		res.json(blog);
	} catch (error) {
		console.error('Error creating blog:', error.message);
		throw new Error('Could not create blog.');
	}
}

export async function deleteBlogCategory(req, res) {
	try {
		const { id: blogId } = req.params;

		const blog = await blogCategory.findByIdAndDelete(blogId);

		if (!blog) {
			return res.status(404).json({ error: 'blog not found.' });
		}

		res.json({ meassage: 'blog is deleted!', blog });
	} catch (error) {
		console.error('Error creating blog:', error.message);
		throw new Error('Could not create blog.');
	}
}
