import mongoose from "mongoose";

// Define the subdocument schema for cart items
const cartItemSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product", // Assuming you have a Product model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    default: 1, // Default quantity is 1
  },
  size:{
    type:String,
  }
});

// Define the main cart schema
const cartSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: {
    type: [cartItemSchema], // Array of cart item subdocuments
    default: [],
  },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
