import { Router } from "express";
import { authenticateSeller } from "../middleware/auth.middleware.js";
import {
  createProduct,
  getSellerProducts,
  getAllProducts,
  getProductDetails,
  deleteProduct
} from "../controllers/product.controller.js";
import multer from "multer";
import { createProductValidator } from "../validator/product.validation.js";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
});
const router = Router();

router.post(
  "/create",
  authenticateSeller,
  upload.array("images", 7),
  createProductValidator,
  createProduct,
);

router.get("/seller", authenticateSeller, getSellerProducts);
router.get("/", getAllProducts);
router.get("/details/:id", getProductDetails);
router.delete("/delete/:id", authenticateSeller, deleteProduct);

export default router;
