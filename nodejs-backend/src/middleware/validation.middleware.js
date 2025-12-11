/**
 * Validation Middleware
 * Request validation using express-validator
 */

const { body, param, validationResult } = require('express-validator');

/**
 * Check validation results
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array()
    });
  }
  next();
};

/**
 * Auth validation rules
 */
const authValidation = {
  login: [
    body('username').optional().notEmpty().withMessage('Username is required'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
    validate
  ],
  register: [
    body('username').notEmpty().withMessage('Username is required')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
  ]
};

/**
 * User validation rules
 */
const userValidation = {
  create: [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').optional().isIn(['ADMIN', 'USER']).withMessage('Role must be ADMIN or USER'),
    validate
  ],
  update: [
    param('id').isInt().withMessage('Valid user ID is required'),
    body('username').optional().notEmpty().withMessage('Username cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
    validate
  ]
};

/**
 * Team validation rules
 */
const teamValidation = {
  create: [
    body('name').notEmpty().withMessage('Team name is required'),
    body('game').notEmpty().withMessage('Game is required'),
    validate
  ],
  update: [
    param('id').isInt().withMessage('Valid team ID is required'),
    body('name').optional().notEmpty().withMessage('Team name cannot be empty'),
    validate
  ]
};

/**
 * Event validation rules
 */
const eventValidation = {
  create: [
    body('name').notEmpty().withMessage('Event name is required'),
    body('type').notEmpty().withMessage('Event type is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    validate
  ],
  update: [
    param('id').isInt().withMessage('Valid event ID is required'),
    body('name').optional().notEmpty().withMessage('Event name cannot be empty'),
    validate
  ]
};

/**
 * Payment validation rules
 */
const paymentValidation = {
  card: [
    body('cardNumber').notEmpty().withMessage('Card number is required')
      .isLength({ min: 13, max: 19 }).withMessage('Invalid card number length'),
    body('cardHolder').notEmpty().withMessage('Card holder name is required'),
    body('expiryMonth').notEmpty().withMessage('Expiry month is required'),
    body('expiryYear').notEmpty().withMessage('Expiry year is required'),
    body('cvv').notEmpty().withMessage('CVV is required')
      .isLength({ min: 3, max: 4 }).withMessage('Invalid CVV'),
    body('amount').isFloat({ min: 0.01 }).withMessage('Valid amount is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    validate
  ]
};

/**
 * Product validation rules
 */
const productValidation = {
  create: [
    body('name').notEmpty().withMessage('Product name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    body('category').notEmpty().withMessage('Category is required'),
    validate
  ],
  update: [
    param('id').isInt().withMessage('Valid product ID is required'),
    body('name').optional().notEmpty().withMessage('Product name cannot be empty'),
    body('price').optional().isFloat({ min: 0 }).withMessage('Valid price is required'),
    validate
  ]
};

/**
 * Post validation rules
 */
const postValidation = {
  create: [
    body('title').notEmpty().withMessage('Post title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
    validate
  ],
  update: [
    param('id').isInt().withMessage('Valid post ID is required'),
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    validate
  ]
};

/**
 * Membership validation rules
 */
const membershipValidation = {
  create: [
    body('name').notEmpty().withMessage('Membership name is required'),
    body('price').isFloat({ min: 0 }).withMessage('Valid price is required'),
    validate
  ],
  update: [
    param('id').isInt().withMessage('Valid membership ID is required'),
    body('name').optional().notEmpty().withMessage('Name cannot be empty'),
    validate
  ]
};

module.exports = {
  validate,
  authValidation,
  userValidation,
  teamValidation,
  eventValidation,
  paymentValidation,
  productValidation,
  postValidation,
  membershipValidation
};
