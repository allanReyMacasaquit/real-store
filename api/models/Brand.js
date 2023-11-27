// Import Mongoose for schema creation
import mongoose from 'mongoose';

// Define the Brand Schema
const brandSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			unique: true,
			index: true,
		},
	},
	{ timestamps: true }
);

// Create and export the Brand model based on the schema
const Brand = mongoose.model('Brand', brandSchema);
export default Brand;
