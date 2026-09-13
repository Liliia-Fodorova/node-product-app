import { Product } from "../models/product.js"
import createHttpError from "http-errors"
export const getProducts = async (req ,res) => {
    const products = await Product.find()
    res.status(200).json(products)
}
export const getProductsById = async (req, res) => {
    const {productId} = req.params
    const product = await Product.findOne({
        _id: productId
    })
    if(!product){
        throw createHttpError(404, 'Not Found Product.')
    }
    res.status(200).json(product)
}
