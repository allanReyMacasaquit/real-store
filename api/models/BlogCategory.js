// Import Mongoose for schema creation
import mongoose from 'mongoose';

// Define the Brand Schema
const blogCategorySchema = new mongoose.Schema(
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
const blogCategory = mongoose.model('blogCategory', blogCategorySchema);
export default blogCategory;
