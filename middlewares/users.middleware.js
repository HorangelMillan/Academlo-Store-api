// Models
const { Users } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const isEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body;

    const user = await Users.findOne({
        where: {
            email,
            status: 'active'
        }
    });

    if (!user) {
        return next(new AppError('This user is not exist anymore'));
    };

    req.body.user = user;
    next();
});

module.exports = { isEmail };