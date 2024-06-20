import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true,
    },
    desc:{
        type:String,
    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type:String,
        required:true
    }
})

const Product = mongoose.model("Product",productSchema);
export default Product;