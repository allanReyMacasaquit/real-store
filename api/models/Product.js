import mongoose from 'mongoose';
import slugify from 'slugify';

// Define the Product Schema
const productSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		brands: {
			type: String,
			required: true,
			enum: ['Apple', 'Samsung', 'Lenovo'],
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		description: {
			type: String,
			required: true,
		},
		quantity: {
			type: Number,
			required: true,
			default: 0,
		},
		category: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Category',
		},
		images: {
			type: Array,
			required: true,
		},
		color: {
			type: String,
			enum: ['Black', 'Red', 'Brown'],
		},
		sold: {
			type: Number,
			default: 0,
		},

		ratings: [
			{
				star: Number,
				postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
			},
		],
	},
	{
		timestamps: true,
	}
);

productSchema.pre('save', function (next) {
	if (this.isModified('title')) {
		this.slug = slugify(this.title, { lower: true, strict: true });
	}
	next();
});

// Create the Product model
const Product = mongoose.model('Product', productSchema);

export default Product;
