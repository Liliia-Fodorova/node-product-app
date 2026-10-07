import { Router } from "express";
import {
    createProduct,
    deleteProduct,
    getProducts,
    getProductsById,
    updateProduct
} from "../controllers/productsController.js";
// import { authenticate } from '../middleware/authenticate.js';


const router = Router();

// router.use('/products', authenticate);

router.get('/products', getProducts);
router.get('/products/:productId', getProductsById);
router.post('/products', createProduct);
router.patch('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

export default router;
