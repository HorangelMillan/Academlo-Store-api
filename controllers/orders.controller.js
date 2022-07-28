// Models
const { Orders } = require('../models/order.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const createOrder = catchAsync(async (req, res, next) => {
    const { totalPrice, user, cart } = req.body;

    const order = await Orders.create({
        userId: user.id,
        cartId: cart.id,
        totalPrice
    });

    req.body.order = order;
    next()
});

module.exports = { createOrder };