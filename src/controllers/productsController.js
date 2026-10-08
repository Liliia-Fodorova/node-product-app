import { Product } from "../models/product.js";
import createHttpError from "http-errors";


export const getProducts = async (req, res) => {

    const products = await Product.find({ userId: req.user._id });
    res.status(200).json(products);
};
export const getProductsById = async (req, res) => {
    const { productId } = req.params;

    const product = await Product.findOne({
        _id: productId,
        userId: req.user._id,
    });
    if(!product){
        throw createHttpError(404, 'Not Found Product.');
    }
    res.status(200).json(product);
};

export const createProduct = async (req, res) => {

    const product = await Product.create({
        ...req.body,
       userId: req.user._id,
    });
    res.status(201).json(product);
};

export const updateProduct = async (req, res)=>{
    const { productId } = req.params;


    const product = await Product.findOneAndUpdate({
        _id: productId,
        userId: req.user._id,
    },
        req.body,
        {
            returnDocument: 'after',
        }
    );

    if(!product){
        throw createHttpError(404, 'Product not found');
    }
    res.status(200).json(product);


};

export const deleteProduct = async(req, res) => {
    const { productId } = req.params;


    const product = await Product.findOneAndDelete({
        _id: productId,
        userId: req.user._id,
    });

    if(!product){
        throw createHttpError(404, 'Product not found');
}
   res.status(200).json(product);
};
