import { connectDB } from "../lib/connectDB.js";
import { Category } from "../models/category.js";
import { Food } from "../models/food.js";

export const getFood = async (req, res) => {
    try {
        await connectDB();
        const food = await Food.findOne({ _id: req?.params?.id }).populate("category", "name -_id");
        return res.status(200).json({ food, message: "successfully get data" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ foods: [], message: "Server error" });
    }
};
export const getFoods = async (req, res) => {
    try {
        await connectDB();
        const { limit = 0, category } = req.query;

        const pipeline = [
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category",
                },
            },
            { $unwind: "$category" },
        ];

        if (category) {
            pipeline.push({
                $match: {
                    "category.name": category.toLowerCase().trim(),
                },
            });
        }

        pipeline.push({
            $project: {
                title: 1,
                description: 1,
                price: 1,
                photo: 1,
                unit: 1,
                category: {
                    name: "$category.name",
                },
            },
        });
        if (Number(limit) > 0) pipeline.push({ $limit: Number(limit) });

        const foods = await Food.aggregate(pipeline);
        return res.status(200).json({ foods, message: "successfully get data" });

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