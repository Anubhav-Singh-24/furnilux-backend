import Product from "../models/product.js"


export const getAllProdcuts =  async(req,res)=>{
    try {
        const prod = await Product.find({});
        return res.status(200).json(prod)
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const getCategory = async(req,res)=>{
    try {
        const {cat} = req.params;
        const prod = await Product.find({category:cat});
        return res.status(200).json(prod);
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getProductById = async(req,res)=>{
    try {
        const {id} = req.params;
        const prod = await Product.findById(id);
        return res.status(200).json(prod);
    } catch (error) {
        return res.status(500).json(error);
    }
}
