import { Router } from "express";
import { addFood, getCategories, getFood, getFoods } from "../controllers/food.js";

const router = Router();

router.get("/", getFood);
router.get("/all", getFoods);
router.get("/categories", getCategories);
router.post("/", addFood);

export default router;