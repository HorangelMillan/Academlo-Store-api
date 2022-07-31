// Models
const { Products } = require('../models/product.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const isQuantityExceeded = catchAsync(async (req, res, next) => {
    const { quantity, product } = req.body;

    if (product.quantity < quantity) {
        return next(new AppError('quantity has been exeeded', 401))
    };

    next();
});

const isProduct = catchAsync(async (req, res, next) => {
    const { productId } = req.body;
    const { id } = req.params;
    const productParam = req.params.productId;

    const dinamycId = productId || id || productParam;

    const product = await Products.findOne({
        where: {
            id: parseInt(dinamycId),
            status: 'active'
        }
    });

    if (!product) {
        return next(new AppError('product is not exist', 404));
    };

    req.body.product = product;
    next();
});

module.exports = {
    isQuantityExceeded,
    isProduct
};