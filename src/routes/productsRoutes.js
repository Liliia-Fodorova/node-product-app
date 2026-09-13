import { Router } from "express"
import { createProduct, deleteProduct, getProducts, getProductsById, updateProduct } from "../controllers/productsController.js"
const router = Router()
router.get('/products', getProducts)
router.get('/products/:productId', getProductsById);
router.post('/products', createProduct);
router.patch('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);
export default router
