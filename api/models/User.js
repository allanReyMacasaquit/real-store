import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			required: true,
		},
		lastname: {
			type: String,
			required: true,
		},
		mobile: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: String,
			default: 'user',
		},
		cart: {
			type: Array,
			default: [],
		},
		address: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Address' }],
		wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
	},
	{ timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
