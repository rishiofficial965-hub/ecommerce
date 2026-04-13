import { body, validationResult } from "express-validator";

function validationRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  next();
}

export const validationRegisterUser = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("contact")
    .notEmpty()
    .withMessage("contact is required")
    .matches(/^\d{10}$/)
    .withMessage("contact must be a 10-digit number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must br at least 6 character long"),
  body("fullname")
    .notEmpty()
    .withMessage("full name is required")
    .isLength({ min: 3 })
    .withMessage("full name must be at least 3 character long"),
  body("isSeller").isBoolean().withMessage("seller must be boolean value"),

  validationRequest,
];

export const validationLoginUser = [
  body("email").isEmail().withMessage("Invalid email format"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must br at least 6 character long"),

  validationRequest,
];
