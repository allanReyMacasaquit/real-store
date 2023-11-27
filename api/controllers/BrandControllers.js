import Brand from '../models/Brand.js';

export async function createBrand(req, res) {
	try {
		const { title } = req.body;
		const brand = await Brand.create({ title });
		res.json({ message: 'New Brand has created!', brand });
	} catch (error) {
		console.error(error);
		console.log('Server error');
	}
}

export async function updateBrand(req, res) {
	try {
		const { id: brandId } = req.params;

		const brand = await Brand.findByIdAndUpdate(brandId, req.body, {
			new: true,
		});

		if (!brand) {
			return res.status(404).json({ error: 'Brand not found.' });
		}

		res.json(brand);
	} catch (error) {
		console.error('Error creating brand:', error.message);
		throw new Error('Could not create brand.');
	}
}

export async function getBrands(req, res) {
	try {
		const brand = await Brand.find();

		if (!brand) {
			return res.status(404).json({ error: 'brand not found.' });
		}

		res.json(brand);
	} catch (error) {
		console.error('Error creating category:', error.message);
		throw new Error('Could not create brand.');
	}
}
export async function getBrand(req, res) {
	try {
		const { id: brandId } = req.params;

		const brand = await Brand.findById(brandId);

		if (!brand) {
			return res.status(404).json({ error: 'Brand not found.' });
		}

		res.json(brand);
	} catch (error) {
		console.error('Error creating brand:', error.message);
		throw new Error('Could not create brand.');
	}
}

export async function deleteBrand(req, res) {
	try {
		const { id: brandId } = req.params;

		const brand = await Brand.findByIdAndDelete(brandId);

		if (!brand) {
			return res.status(404).json({ error: 'Brand not found.' });
		}

		res.json({ meassage: 'Brand is deleted!', brand });
	} catch (error) {
		console.error('Error creating brand:', error.message);
		throw new Error('Could not create brand.');
	}
}
