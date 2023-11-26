// Import required modules
import mongoose from 'mongoose';

// Define the Category Schema
const categorySchema = new mongoose.Schema(
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

// Create and export the Category model based on the schema
const Category = mongoose.model('Category', categorySchema);

export default Category;
