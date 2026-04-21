import { param, body, validationResult } from "express-validator";

const validationRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
      error: errors.array()[0].msg,
    });
  }
  next();
};

// Used on POST /add/:productId/:varientId
export const validateAddToCart = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  // BUG FIX: varientId is required (not optional) — it's always in the URL path
  param("varientId").isMongoId().withMessage("Invalid variant ID"),
  body("quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),
  validationRequest,
];

// Used on PATCH /update/:productId/:varientId
export const validateUpdateCart = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  param("varientId").isMongoId().withMessage("Invalid variant ID"),
  body("quantity")
    .notEmpty()
    .withMessage("quantity is required")
    .isInt({ min: 0 })
    .withMessage("Quantity must be 0 or greater"),
  validationRequest,
];

// Used on DELETE /remove/:productId/:varientId
export const validateRemoveFromCart = [
  param("productId").isMongoId().withMessage("Invalid product ID"),
  param("varientId").isMongoId().withMessage("Invalid variant ID"),
  validationRequest,
];
