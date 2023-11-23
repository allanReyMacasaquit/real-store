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
		const { page = 1, limit = 10, fields, sort, ...queryObj } = req.query;

		const excludedFields = ['page', 'sort', 'limit', 'fields'];
		excludedFields.forEach((field) => delete queryObj[field]);

		Object.keys(queryObj).forEach((key) => {
			queryObj[key] = { $regex: new RegExp(queryObj[key], 'i') };
		});

		convertToOperators(queryObj);

		let fetchedProducts = await Product.find(queryObj)
			.select(fields ? fields.split(',').join(' ') : '')
			.skip((page - 1) * limit)
			.limit(parseInt(limit))
			.sort(sort ? sort.split(',').join(' ') : '-createdAt');

		res.json(fetchedProducts);
	} catch (error) {
		next(errorHandler(500, 'Internal Server Error'));
	}
}

function convertToOperators(queryObj) {
	const operatorsMap = { gte: '$gte', gt: '$gt', lte: '$lte', lt: '$lt' };

	Object.keys(queryObj).forEach((key) => {
		if (operatorsMap[key]) {
			queryObj[operatorsMap[key]] = queryObj[key];
			delete queryObj[key];
		}
	});
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

		// Check if the update includes the 'title' field
		if (updateData.title) {
			// Generate the slug from the updated title using slugify
			const updatedTitle = updateData.title;
			const updatedSlug = slugify(updatedTitle, { lower: true });

			// Update the 'title' and 'slug' fields in the updateData object
			updateData.title = updatedTitle;
			updateData.slug = updatedSlug;
		}

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
