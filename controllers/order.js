import { connectDB } from "../lib/connectDB.js";
import { Food } from "../models/food.js";
import { Order } from "../models/order.js";

export const getOrders = async (req, res) => {
    try {
        await connectDB();
        const orders = await Order.find().populate("foods");
        return res.status(200).json({ orders, message: "successfully get data" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ orders: [], message: "Server error" });
    }
};

export const orderHandler = (io, socket) => {
    console.log('user', socket.id)
    socket.on("placeOder", async (data, callback) => {
        try {
            await connectDB();
            const orders = await Order.find().populate("foods");
            console.log("place order by", socket.id)
        } catch (err) {
            console.error(err)
        }
    })
}