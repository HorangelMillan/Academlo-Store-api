const jwt = require('jsonwebtoken');
require('dotenv').config();

// Models
const { Users } = require('../models/user.model');
const { Products } = require('../models/product.model');
const { Orders } = require('../models/order.model');
const { Carts } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productsInCart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { Email } = require('../utils/email.util');

// create controllers
const createUser = catchAsync(async (req, res, next) => {
    const { username, email, hashPassword } = req.body;

    const createdUser = await Users.create({
        username,
        email,
        password: hashPassword
    });

    delete createdUser.password

    // SMT SES AWS Not work
    if (process.env.NODE_ENV === 'development') {
        await new Email(email).sendWelcome(username);
    };

    res.status(200).json({
        status: 'success',
        createdUser
    });
});

const login = catchAsync(async (req, res, next) => {
    const { user } = req.body;

    const token = await jwt.sign({ id: user.id }, process.env.PRIVATE_KEY, {
        expiresIn: process.env.NODE_ENV === 'development' ? '5m' : '30m'
    });

    res.status(200).json({
        status: 'success',
        token
    });
});

const getProductsUser = catchAsync(async (req, res, next) => {
    const { user } = req.body;

    const products = await Products.findAll({
        where: {
            userId: user.id
        }
    });

    res.status(200).json({
        status: 'success',
        products
    });
});

const updateUser = catchAsync(async (req, res, next) => {
    const { username, email, user } = req.body;

    await Users.update({
        username,
        email
    }, {
        where: {
            id: user.id
        }
    });

    res.status(200).json({
        status: 'success',
    });
});

const disableAcount = catchAsync(async (req, res, next) => {
    const { user } = req.body;

    await Users.update({
        status: 'disabled'
    }, {
        where: {
            id: user.id
        }
    });

    res.status(200).json({
        status: 'success',
    });
});

const getPurchasesUser = catchAsync(async (req, res, next) => {
    const { user } = req.body;

    const orders = await Orders.findAll({
        where: {
            userId: user.id
        },
        include: {
            model: Carts,
            include: {
                model: ProductsInCart,
                where: {
                    status: 'purchased'
                },
                include: {
                    model: Products
                }
            }
        }
    });

    res.status(200).json({
        status: 'success',
        orders
    });
});

const getOrderUser = catchAsync(async (req, res, next) => {
    const { user } = req.body;
    const { id } = req.params;

    const orders = await Orders.findOne({
        where: {
            userId: user.id,
            id
        },
        include: {
            model: Carts,
            include: {
                model: ProductsInCart,
                where: {
                    status: 'purchased'
                },
                include: {
                    model: Products
                }
            }
        }
    });

    res.status(200).json({
        status: 'success',
        orders
    });
});

module.exports = {
    createUser,
    login,
    getProductsUser,
    updateUser,
    disableAcount,
    getPurchasesUser,
    getOrderUser
};