import mongoose from 'mongoose';

// Define the schema for the blog post
const blogSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		category: {
			type: String,
			required: true,
		},
		numViews: {
			type: Number,
			default: 0,
		},
		isLiked: {
			type: Boolean,
			default: false,
		},
		isDisliked: {
			type: Boolean,
			default: false,
		},
		likes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		dislikes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		author: {
			type: String,
			default: 'Admin',
		},
		tags: {
			type: [String],
			default: [],
		},
		image: {
			type: String,
			default:
				'https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=1600',
		},
		comments: [
			{
				text: String,
				author: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'User', // Reference to the User model for comment author
				},
				date: {
					type: Date,
					default: Date.now,
				},
			},
		],
	},
	{
		toJSON: {
			virtuals: true,
		},
		toObject: {
			virtuals: true,
		},
		timestamps: true,
	}
);

// Create the Blog model using the schema
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
