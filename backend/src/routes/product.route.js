import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import { createProduct } from "../controllers/product.controller.js";

const router = Router();

router.post("/create", authenticateSeller, createProduct);

export default router;
