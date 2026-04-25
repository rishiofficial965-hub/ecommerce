import { body, validationResult } from "express-validator";

export const createProductValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("priceAmount").notEmpty().withMessage("Price amount is required"),
  body("priceCurrency").notEmpty().withMessage("Price currency is required"),
  body("variants")
    .optional()
    .custom((value) => {
      try {
        if (!value) return true;
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed))
          throw new Error("Variants must be an array");
        return true;
      } catch (e) {
        throw new Error("Invalid variants format");
      }
    }),
  validateRequest,
];

export const updateProductValidator = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  body("priceAmount")
    .optional()
    .notEmpty()
    .withMessage("Price amount cannot be empty"),
  body("priceCurrency")
    .optional()
    .notEmpty()
    .withMessage("Price currency cannot be empty"),
  body("variants")
    .optional()
    .custom((value) => {
      try {
        if (!value) return true;
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed))
          throw new Error("Variants must be an array");
        return true;
      } catch (e) {
        throw new Error("Invalid variants format");
      }
    }),
  validateRequest,
];

export function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: errors.array()[0].msg });
  }
  next();
}
