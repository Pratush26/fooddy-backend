import { connectDB } from "../lib/connectDB";
import { Food } from "../models/food";

export const getFood = (req, res) => {
    res.json({ success: true, message: "Express app is running 🚀" });
};
export const getFoods = (req, res) => {
    res.json({ success: true, message: "Express app is running 🚀" });
};
export const addFood = async(req, res) => {
    try {
        await connectDB();
        const { title, description, category, photo, price, stock, unit } = req.body;

        if (!title || !description || !category || !photo || !price || !stock || !unit)
            return res.status(400).json({ message: "All fields are required for food" });

        const existingFood = await Food.findOne({ title });
        if (existingFood)
            return res.status(409).json({ message: "Food already exists" });

        const food = await Food.create({ title, description, category, photo, price, stock, unit });

        return res.status(201).json({ food, message: "Food added successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};