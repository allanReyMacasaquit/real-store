import Category from '../models/Category.js';

export async function createCategory(req, res) {
	try {
		const { title } = req.body;

		const category = await Category.create({ title });

		res.json(category);
	} catch (error) {
		console.error('Error creating category:', error.message);
		throw new Error('Could not create category.');
	}
}

export async function updateCategory(req, res) {
	try {
		const { id: categoryId } = req.params;

		const category = await Category.findByIdAndUpdate(categoryId, req.body, {
			new: true,
		});

		if (!category) {
			return res.status(404).json({ error: 'Category not found.' });
		}

		res.json(category);
	} catch (error) {
		console.error('Error creating category:', error.message);
		throw new Error('Could not create category.');
	}
}

export async function getCategories(req, res) {
	try {
		const category = await Category.find();

		if (!category) {
			return res.status(404).json({ error: 'Category not found.' });
		}

		res.json(category);
	} catch (error) {
		console.error('Error creating category:', error.message);
		throw new Error('Could not create category.');
	}
}

export async function deleteCategory(req, res) {
	try {
		const { id: categoryId } = req.params;

		const category = await Category.findByIdAndDelete(categoryId);

		if (!category) {
			return res.status(404).json({ error: 'Category not found.' });
		}

		res.json({ meassage: 'Category is deleted!', category });
	} catch (error) {
		console.error('Error creating category:', error.message);
		throw new Error('Could not create category.');
	}
}
