import mongoose from 'mongoose';
import crypto from 'crypto';

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
		resetPasswordToken: String,
		resetPasswordExpires: Date,
		role: {
			type: String,
			enum: ['user', 'admin'],
			default: 'user',
		},
		isBlocked: {
			type: Boolean,
			default: false,
		},
		cart: {
			type: [Array],
			default: [],
		},
		address: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Address',
			},
		],
		wishlist: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Product',
			},
		],
	},
	{ timestamps: true }
);

// Create a method on the schema to generate a password reset token and hash it
userSchema.methods.generatePasswordResetToken = async function () {
	try {
		const token = crypto.randomBytes(20).toString('hex'); // Generate a random token
		const hash = crypto.createHash('sha256').update(token).digest('hex'); // Hash the token

		this.resetPasswordToken = hash; // Store the hashed token
		this.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour (3600000 milliseconds)

		await this.save(); // Save the updated user document

		return token; // Return the non-hashed token
	} catch (error) {
		throw error; // Throw any encountered errors
	}
};

const User = mongoose.model('User', userSchema);

export default User;
