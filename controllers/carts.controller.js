// Models
const { ProductsInCart } = require('../models/productsInCart.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const addProductToCart = catchAsync(async (req, res, next) => {
    const { productId, quantity, cart } = req.body;

    let productsInCart;

    if (cart.status === 'removed') {
        productsInCart = await ProductsInCart.update({
            quantity
        }, {
            where: {
                cartId: cart.id
            }
        });
    } else {
        productsInCart = await ProductsInCart.create({
            cartId: cart.id,
            productId,
            quantity
        });
    };

    res.status(200).json({
        status: 'success',
        productsInCart
    });
});

const updateProductInCart = catchAsync(async (req, res, next) => {
    const { product, quantity, cart } = req.body;

    const quantityJson = {
        quantity
    };

    const statusJson = {
        status: 'removed'
    };

    await ProductsInCart.update(quantity != 0 ? quantityJson : statusJson, {
        where: {
            cartId: cart.id,
            productId: product.id
        }
    });

    res.status(200).json({
        status: 'success',
    });
});

const removeProductInCart = catchAsync(async (req, res, next) => {
    const { product, cart } = req.body;

    await ProductsInCart.update({
        quantity: 0,
        status: 'removed'
    }, {
        where: {
            cartId: cart.id,
            productId: product.id
        }
    });

    res.status(200).json({
        status: 'success',
    });
});

const purchase = catchAsync(async (req, res, next) => {
    const { order } = req.body;

    res.status(200).json({
       status: 'success',
       order
    });
});

module.exports = {
    addProductToCart,
    updateProductInCart,
    removeProductInCart,
    purchase
};