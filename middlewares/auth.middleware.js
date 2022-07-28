const jwt = require('jsonwebtoken');
const becrypt = require('bcryptjs');
require('dotenv').config();

// Models
const { Users } = require('../models/user.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const protectSession = catchAsync(async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    };

    if (!token) {
        return next(new AppError('Invalid session', 401));
    };

    const decrypt = await jwt.verify(token, process.env.PRIVATE_KEY);

    const user = await Users.findOne({
        where: {
            id: decrypt.id,
            status: 'active'
        }
    });

    if (!user) {
        return next(new AppError('this user is not exit anymore', 410));
    };

    req.body.user = user;
    next();
});

const comparePassword = catchAsync(async (req, res, next) => {
    const { password, user } = req.body;

    const verifyPassword = await becrypt.compare(password, user.password);

    if (!verifyPassword) {
        return next(new AppError('invalid credentials', 401));
    };

    next();
});

const protectUserAcounts = catchAsync(async (req, res, next) => {
    const { id } = req.params; // existe el param
    const { user, product } = req.body;

    const dinamycId = product ? product.userId : id;

    if (parseInt(dinamycId) !== user.id) {
        return next(new AppError('this acount does not bellong to you'))
    };

    next()
});

module.exports = {
    protectSession,
    comparePassword,
    protectUserAcounts
};