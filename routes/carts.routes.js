const express = require('express');

// Controllers
const {
    addProductToCart,
    updateProductInCart,
    removeProductInCart,
    purchase
} = require('../controllers/carts.controller');
const { createOrder } = require('../controllers/orders.controller');

// Middlewares
const { protectSession } = require('../middlewares/auth.middleware');

const {
    isCartUser,
    isProductInCart,
    subtractItems
} = require('../middlewares/carts.middlewares');
const {
    isProduct,
    isQuantityExceeded
} = require('../middlewares/products.middlewares');

const { addProductValidators } = require('../middlewares/validators.middleware');

// create routers
const cartsRouter = express.Router();

cartsRouter.post('/add-product',
    protectSession,
    addProductValidators,
    isCartUser,
    isProduct,
    isQuantityExceeded,
    isProductInCart,
    addProductToCart
);
cartsRouter.patch('/update-cart',
    protectSession,
    isCartUser,
    isProduct,
    isQuantityExceeded,
    updateProductInCart
);
cartsRouter.delete('/:productId', protectSession, isCartUser, isProduct, removeProductInCart);
cartsRouter.post('/purchase', protectSession, isCartUser, subtractItems, createOrder, purchase);

module.exports = { cartsRouter };