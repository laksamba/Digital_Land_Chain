import { body } from 'express-validator';


const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const registerValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 3 }).withMessage('Name must be at least 3 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .matches(emailRegex).withMessage('Invalid email format')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),

  body('walletAddress')
    .notEmpty().withMessage('Wallet address is required')
    .matches(/^0x[a-fA-F0-9]{40}$/).withMessage('Invalid Ethereum wallet address')
];
