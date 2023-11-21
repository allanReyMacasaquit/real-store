import Product from '../models/Product.js';
import errorHandler from '../middlewares/errorhandler.js';
import slugify from 'slugify';

export async function createProduct(req, res, next) {
	try {
		const {
			title,
			price,
			description,
			category,
			images,
			color,
			quantity,
			brands,
		} = req.body;

		// Generate slug from the title using slugify
		const slug = slugify(title, { lower: true, strict: true });

		const newProduct = await Product.create({
			title,
			slug,
			price,
			description,
			category,
			images,
			color,
			quantity,
			brands,
		});

		res.json({
			message: 'Product Created Successfully!',
			newProduct,
		});
	} catch (error) {
		next(errorHandler(500, 'Duplicate title name'));
	}
}

export async function getProducts(req, res, next) {
	try {
		const products = await Product.find();
		if (!products || products.length === 0) {
			return res.status(404).json({ message: 'No products found' });
		}
		res.json(products);
	} catch (error) {
		next(errorHandler(500, 'Internal Server Error'));
	}
}

export async function getProduct(req, res, next) {
	try {
		const _id = req.params.id;
		const productById = await Product.findById(_id);
		if (!productById) {
			return res.status(404).json({ message: 'Product not found' });
		}
		res.json(productById);
	} catch (error) {
		next(errorHandler(401, 'Unauthorized'));
	}
}

export async function updateProduct(req, res, next) {
	try {
		const productId = req.params.id;
		const updateData = req.body;

		const updatedProduct = await Product.findByIdAndUpdate(
			productId,
			updateData,
			{ new: true, runValidators: true }
		);

		if (!updatedProduct) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.json({
			message: 'Product updated successfully',
			updatedProduct,
		});
	} catch (error) {
		next(error);
	}
}

export async function deleteProduct(req, res, next) {
	try {
		const productId = req.params.id;

		const deletedProduct = await Product.findByIdAndDelete(productId);

		if (!deletedProduct) {
			return res.status(404).json({ message: 'Product not found' });
		}

		res.json({
			message: 'Product deleted successfully',
			deletedProduct,
		});
	} catch (error) {
		next(error);
	}
}
