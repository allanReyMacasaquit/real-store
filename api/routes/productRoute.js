import express from 'express';
import {
	createProduct,
	deleteProduct,
	getProduct,
	getProducts,
	updateProduct,
} from '../controllers/ProductController.js';
import authMiddleware from '../middlewares/authorizedUser.js';
import { isAdmin } from '../middlewares/authorizedUser.js';

const productRoute = express.Router();

productRoute.post('/create', authMiddleware, isAdmin, createProduct);
productRoute.get('/get', getProducts);
productRoute.get('/get/:id', getProduct);
productRoute.put('/update/:id', authMiddleware, isAdmin, updateProduct);
productRoute.delete('/delete/:id', authMiddleware, isAdmin, deleteProduct);

export default productRoute;
