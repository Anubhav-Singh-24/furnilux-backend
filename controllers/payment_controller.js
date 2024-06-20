import Purchase from "../models/purchase_history.js";
import Cart from "../models/cart.js";
import Product from "../models/product.js";

export const purchase = async (req, res) => {
  const userId = req.user.id;
  const { amount, status } = req.body;
  try {
    const cart = await Cart.findOne({ userId: userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }
    const orderId = `${userId}_${Date.now()}`;
    const purchase = await Purchase.findOneAndUpdate(
      { userId: userId },
      {
        $push: {
          orders: {
            orderId: orderId,
            products: cart.items,
            amount: amount,
            paymentStatus: status,
          },
        },
      },
      { upsert: true, new: true }
    );
    await Cart.updateOne({ userId: userId }, { items: [] });
    return res.status(200).json({ msg: "Order Successfull" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const getPurchase = async (req, res) => {
  const userId = req.user.id;
  try {
    const purchase = await Purchase.findOne({ userId: userId });
    if (!purchase || purchase.orders.length === 0) {
      return res.status(200).json([]);
    }
    let purchaseHistory = [];
    for (const orders of purchase.orders) {
      let orderDetails = {
        orderId: orders.orderId,
        amount: orders.amount,
        date: orders.createdAt,
        products: [],
      };
      for (const items of orders.products) {
        const product = await Product.findById(items.productId);
        if (product) {
          orderDetails.products.push({
            productName: product.name,
            productImage: product.image,
            productSize: items.size,
            productQuant: items.quantity,
          });
        }
      }
      purchaseHistory.push(orderDetails);
    }
    return res.status(200).json(purchaseHistory);
  } catch (error) {
    return res.status(500).json(error);
  }
};
