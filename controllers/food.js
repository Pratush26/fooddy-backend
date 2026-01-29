import { connectDB } from "../lib/connectDB.js";
import { Category } from "../models/category.js";
import { Food } from "../models/food.js";

export const getFood = (req, res) => {
    res.json({ success: true, message: "Express app is running 🚀" });
};
export const getFoods = async (req, res) => {
    try {
        await connectDB();
        const query = {}
        const foods = await Food.find(query);

        return res.status(201).json({ foods, message: "successfully get data" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ foods: [], message: "Server error" });
    }
};
export const getCategories = async (req, res) => {
    try {
        await connectDB();
        const categories = await Category.find({});

        return res.status(201).json({ categories, message: "successfully get data" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ foods: [], message: "Server error" });
    }
};
export const addFood = async (req, res) => {
    try {
        await connectDB();
        const { title, description, category, photo, price, stock, unit } = req.body;

        if (!title || !description || !category || !photo || !price || !stock || !unit)
            return res.status(400).json({ message: "All fields are required for food" });

        const existingFood = await Food.findOne({ title });
        if (existingFood)
            return res.status(409).json({ message: "Food already exists" });

        const normalizedCategory = category.toLowerCase();

        const categoryDoc = await Category.findOneAndUpdate(
            { name: normalizedCategory },
            { $setOnInsert: { name: normalizedCategory } },
            { new: true, upsert: true }
        );
        const food = await Food.create({ title, description, category: categoryDoc._id, photo, price, stock, unit });

        return res.status(201).json({ food, message: "Food added successfully" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};