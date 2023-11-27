import express from 'express';
import {
	createBrand,
	deleteBrand,
	getBrand,
	getBrands,
	updateBrand,
} from '../controllers/BrandControllers.js';
import authMiddleware, { isAdmin } from '../middlewares/authorizedUser.js';

const brandRoute = express.Router();

brandRoute.post('/create_brand', authMiddleware, isAdmin, createBrand);
brandRoute.put('/update_brand/:id', authMiddleware, isAdmin, updateBrand);
brandRoute.get('/get_brands', getBrands);
brandRoute.get('/get_brand/:id', getBrand);
brandRoute.delete('/delete_brand/:id', authMiddleware, isAdmin, deleteBrand);

export default brandRoute;
