const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// Auth validators
const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 60 }).withMessage('Name must be 2–60 characters')
    .escape(),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('rollNo')
    .optional()
    .trim()
    .isLength({ max: 20 }).withMessage('Roll number too long')
    .escape(),
  body('stream')
    .optional()
    .isIn(['Science', 'Commerce', 'Arts', 'Other', '']).withMessage('Invalid stream'),
  validate,
];

const otpValidator = [
  body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  body('otp').trim().isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits').isNumeric().withMessage('OTP must be numeric'),
  validate,
];

// Application validators
const applicationValidator = [
  body('subjects')
    .isArray({ min: 1 }).withMessage('At least one subject is required'),
  body('subjects.*.subject')
    .trim().notEmpty().withMessage('Subject name is required').escape(),
  body('subjects.*.currentMarks')
    .isInt({ min: 0, max: 100 }).withMessage('Marks must be between 0 and 100'),
  body('reason')
    .trim().notEmpty().withMessage('Reason is required')
    .isLength({ min: 20, max: 1000 }).withMessage('Reason must be 20–1000 characters')
    .escape(),
  body('rollNo').optional().trim().escape(),
  body('stream').optional().isIn(['Science', 'Commerce', 'Arts', 'Other', '']),
  validate,
];

module.exports = {
  validate,
  registerValidator,
  otpValidator,
  applicationValidator,
};
