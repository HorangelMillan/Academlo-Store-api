const { body, validationResult } = require('express-validator');

// Utils
const { AppError } = require('../utils/appError.util');

// check results of the validators
const cehckReasult = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const arrayErrors = errors.array();
        const errorsMsg = arrayErrors.map(error => error.msg).join(', ');

        return next(new AppError(errorsMsg, 400));
    };

    next();
};

// User validators
const createUserValidators = [
    body('username').isString().withMessage('Username cannot be empty'),
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password')
        .isAlphanumeric().withMessage('Must contain numbers and letters')
        .isLength({ min: 8 }).withMessage('Must be at least 8 digits long'),
    cehckReasult
];

const updateUserValidators = [
    body('username').isString().withMessage('Username cannot be empty'),
    body('email').isEmail().withMessage('Must provide a valid email'),
    cehckReasult

];

const loginValidators = [
    body('email').isEmail().withMessage('Must provide a valid email'),
    body('password')
        .isAlphanumeric().withMessage('Must contain numbers and letters')
        .isLength({ min: 8 }).withMessage('Must be at least 8 digits long'),
    cehckReasult
];

// Products validators
const createProdutValidators = [
    body('title').isString().withMessage('Username cannot be empty'),
    body('description').isString().withMessage('Username cannot be empty'),
    body('price').isNumeric().withMessage('price must be only numbers'),
    body('quantity').isNumeric().withMessage('quantity must be only numbers'),
    body('categoryId').isNumeric().withMessage('categoryId must be only numbers'),
    cehckReasult
];

// Categories validators
const createCategorieValidators = [
    body('name').isString().withMessage('Username cannot be empty'),
    cehckReasult
];

// Carts validators
const addProductValidators = [
    body('productId').isNumeric().withMessage('categoryId must be only numbers'),
    body('quantity').isNumeric().withMessage('categoryId must be only numbers'),
    cehckReasult
];

module.exports = {
    createUserValidators,
    loginValidators,
    createProdutValidators,
    createCategorieValidators,
    updateUserValidators,
    addProductValidators
};