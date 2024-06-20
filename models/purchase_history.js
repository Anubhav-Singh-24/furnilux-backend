import mongoose from "mongoose";

const purchaseSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orders: [
    {
      orderId: {
        type: String,
        required: true,
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          quantity: {
            type: Number,
            required: true,
          },
          size: String,
        },
      ],
      amount: {
        type: Number,
        required: true,
      },
      paymentStatus: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Purchase = mongoose.model("Purchase", purchaseSchema);
export default Purchase;
