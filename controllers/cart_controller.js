import Cart from '../models/cart.js'
import Product from "../models/product.js";

export const addToCart = async(req,res)=>{
    const userId = req.user.id;
    const {itemId,quantity,size} = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if(cart){
            const ind = cart.items.findIndex(item => item.productId.toString() === itemId);
            if(ind > -1 && cart.items[ind].size === size){
                cart.items[ind].quantity = quantity;
                await cart.save();
                return res.status(200).json({msg:"Quantity updated!!"})
            }else{
                cart.items.push({
                    productId:itemId,
                    quantity:quantity,
                    size:size
                })
                await cart.save();
                return res.status(200).json({msg:"Cart updated!!"});
            }
        }else{
            const newCart = new Cart({
                userId:userId,
                items:[{
                    productId:itemId,
                    quantity:quantity,
                    size:size
                }]
            })
            await newCart.save();
            return res.status(200).json({msg:"Added to cart!!"})
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

export const getCartItems = async(req,res)=>{
     const userId = req.user.id;
     try {
       const cartItems = await Cart.findOne({ userId: userId });
       if (!cartItems) {
         return res.status(200).json([]);
       }
       const cart = [];

       for (const item of cartItems.items) {
         const product = await Product.findById(item.productId);
         if (!product) {
           return res.status(404).json({ msg: "Product not found" });
         }
         cart.push({ name:product.name,id:item._id,image:product.image,desc:product.desc, size: item.size, quantity: item.quantity, price:product.price });
       }

       return res.status(200).json(cart);
     } catch (error) {
       return res.status(500).json(error);
     }
}

export const updateCart = async(req,res)=>{
    const userId = req.user.id
    const {itemId,quantity} = req.body;
    try {
      const cart = await Cart.findOne({ userId: userId });
      if (!cart) {
        return res.status(200).json({ msg: "Cart is empty" });
      }

      const itemIndex = cart.items.findIndex(
        (item) => item._id.toString() === itemId
      );
      if (itemIndex === -1) {
        return res.status(404).json({ msg: "Item not found in cart" });
      }
      cart.items[itemIndex].quantity = quantity;
      await cart.save();

      return res.status(200).json({ msg: "Quantity Updated!" });
    } catch (error) {
      return res.status(500).json(error);
    }
}

export const deleteItem = async(req,res)=>{
    const userId = req.user.id;
    const id = req.params.id;
    try {
        const cart = await Cart.findOne({userId:userId});
        if(!cart){
            return res.status(200).json({msg:"Cart is empty"})
        }
       const itemIndex = cart.items.findIndex(
         (item) => item._id.toString() === id
       );
        if(itemIndex === -1){
            return res.status(404).json({msg:"Item not found in cart!!"})
        }
        cart.items.splice(itemIndex,1);
        await cart.save();
        return res.status(200).json({msg:"Item removed from cart!!"});
    } catch (error) {
        return res.status(500).json(error);
    }
}