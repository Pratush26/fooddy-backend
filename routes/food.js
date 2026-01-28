import { Router } from "express";
import { addFood, getFood, getFoods } from "../controllers/food.js";

const router = Router();

router.get("/", getFood);
router.get("/all", getFoods);
router.post("/", addFood);

export default router;