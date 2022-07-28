const bcrypt = require('bcryptjs');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');

const hashPassword = catchAsync(async (req, res, next) => {
    const { password } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(password, salt);

    req.body.hashPassword = hash;
    next()
});

module.exports = { hashPassword };