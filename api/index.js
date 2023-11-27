import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import userRoute from './routes/userRoute.js';
import productRoute from './routes/productRoute.js';
import morgan from 'morgan';
import blogRoute from './routes/blogRoute.js';
import categoryRoute from './routes/categoryRoute.js';
import brandRoute from './routes/brandRoute.js';
import blogCategoryRoute from './routes/blogCategoryRoute.js';

dotenv.config();

const app = express();
const port = process.env.Port || 4000;

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());

app.use('/api/user', userRoute);
app.use('/api/product', productRoute);
app.use('/api/blog', blogRoute);
app.use('/api/category', categoryRoute);
app.use('/api/brand', brandRoute);
app.use('/api/blog_category', blogCategoryRoute);

// Connect to MongoDB
mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => {
		console.log('Connected to MongoDB');
	})
	.catch((error) => {
		console.error('Error connecting to MongoDB:', error);
	});

app.listen(port, () => {
	console.log(`You are listening to localhost/${port}`);
});

// Middleware for handling error messages
app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500; // Set the status code for the response
	const message = err.message || 'Internal Server Error'; // Set the error message

	return res.status(statusCode).json({
		success: false, // Indicate that the request was not successful
		statusCode,
		message, // Include the error message in the response
	});
});
