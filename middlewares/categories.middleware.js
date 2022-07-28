// models
const { Categories } = require('../models/category.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const isCategory = catchAsync(async (req, res, next) => {
    const { categoryId, name } = req.body;
    const { id } = req.params;

    const dinamycId = categoryId || id;


    const category = await Categories.findOne({
        where: {
            id: dinamycId,
            status: 'active'
        }
    });

    if (!category) {
        return next(new AppError(`${name} is not exist`, 404))
    };

    req.body.category = category;
    next();
});

module.exports = { isCategory };