import { Router } from "express"
import { createProduct, getProducts, getProductsById, updateProduct } from "../controllers/productsController.js"
const router = Router()
router.get('/products', getProducts)
router.get('/products/:productId', getProductsById);
router.post('/products', createProduct);
router.patch('/products/:productId', updateProduct);
export default router
