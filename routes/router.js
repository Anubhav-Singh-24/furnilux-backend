import express from "express";
import Product from "../models/product.js";
import { getAllProdcuts, getCategory, getProductById } from "../controllers/product_controller.js";
import { validateLogin, validateSignup } from "../validator/authvalidator.js";
import { loginUser, logoutUser, refreshtoken, signupUser } from "../controllers/user_controller.js";
import { validateToken } from "../validator/jwtvalidator.js";
import { addToCart, deleteItem, getCartItems, updateCart } from "../controllers/cart_controller.js";
import { getPurchase, purchase } from "../controllers/payment_controller.js";

const router = express.Router();

router.post("/addproduct", async (req,res) => {
  try {
    const newProduct = await new Product(req.body);
    newProduct.save();
    return res.status(200).json({msg:"Product added successfully"});
  } catch (error) {
    return res.status(500).json(error);
  }
});

router.post('/login',validateLogin,loginUser);
router.post('/signup',validateSignup,signupUser);
router.post('/refreshtoken',refreshtoken);
router.post('/logout',logoutUser);

router.get("/getall",getAllProdcuts);
router.get("/getcategory/:cat",getCategory);
router.get("/getprod/:id",getProductById);

router.post("/addtocart",validateToken,addToCart);
router.get("/getcart",validateToken,getCartItems);
router.post("/update",validateToken,updateCart)
router.delete("/delete/:id",validateToken,deleteItem)

router.post('/purchase',validateToken,purchase)
router.get('/purchasehistory',validateToken,getPurchase);


export default router;
