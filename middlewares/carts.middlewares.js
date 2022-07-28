// Models
const { Carts } = require('../models/cart.model');
const { ProductsInCart } = require('../models/productsInCart.model');
const { Products } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const isCartUser = catchAsync(async (req, res, next) => {
    const { user } = req.body;

    let cart = await Carts.findOne({
        where: {
            userId: user.id,
            status: 'active'
        },
        include: { model: ProductsInCart, include: { model: Products } }
    });

    if (!cart) {
        cart = await Carts.create({
            userId: user.id
        });
    };

    req.body.cart = cart;
    next();
});

const isProductInCart = catchAsync(async (req, res, next) => {
    const { cart, product } = req.body;

    const productInCart = await ProductsInCart.findOne({
        where: {
            cartId: cart.id,
            productId: product.id,
            status: 'active'
        }
    });

    if (productInCart) {
        return next(new AppError('this product already exist in cart', 401));
    };

    next();
});

const subtractItems = catchAsync(async (req, res, next) => {
    const { cart } = req.body;

    if (!cart.productsInCarts) {
        return next(new AppError('have no products in you cart'))
    };

    const resultPurchaseProcess = cart.productsInCarts.map(async item => {
        const product = await Products.findOne({
            where: {
                id: item.productId
            }
        });

        await Products.update({
            quantity: product.quantity - item.quantity
        }, {
            where: {
                id: product.id
            }
        });

        await ProductsInCart.update({
            status: 'purchased'
        }, {
            where: {
                id: item.id
            }
        });

        return product.price * item.quantity;
    });

    await Carts.update({
        status: 'purchased'
    }, {
        where: {
            id: cart.id
        }
    });

    const resolveResultProcess = await Promise.all(resultPurchaseProcess);

    const totalPrice = resolveResultProcess.reduce((a, b) => a + b, 0);

    req.body.totalPrice = totalPrice;
    next()
});

module.exports = {
    isCartUser,
    isProductInCart,
    subtractItems
};