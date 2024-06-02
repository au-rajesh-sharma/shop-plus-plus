import asynchandler from "../middleware/asynchandler.js";
import Product from "../models/productModel.js";

//@desc     fetch all products
//@route    GET /api/products
//@acess    public (could be private or private admin)
const getProducts = asynchandler(async (req, res) => {
    const products = await Product.find({})
    res.json(products)
})

//@desc     fetch single product
//@route    GET /api/products/:id
//@acess    public 
const getProductById = asynchandler(async (req, res) => {
    const product = await Product.findById(req.params.id)
    if(product) {return res.json(product)}
    else {
        res.status(404)
        throw new Error('Resource not found')
    }
})

export {getProducts, getProductById};