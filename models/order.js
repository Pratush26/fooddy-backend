// models/order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    foods: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        }
    ],
    status: { type: String, default: "pending" },
    total: { type: Number, required: true },
    deliveryCost: { type: Number },
    estimatedTime: { type: Date },
    paymentStatus: { type: String, default: "unpaid" }
  },
  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);