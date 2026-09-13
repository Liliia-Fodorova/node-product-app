import { Router } from "express"
import { getProducts, getProductsById } from "../controllers/productsController.js"
const route = Router()
route.get('/products', getProducts)
route.get('/products/:productId', getProductsById)
export default route
