const express = require('express');

// Controllers
const {
    createUser,
    login,
    getProductsUser,
    updateUser,
    disableAcount,
    getPurchasesUser,
    getOrderUser,
    uploadArchives
} = require('../controllers/users.controller');

// Middlewares
const { comparePassword, protectSession, protectUserAcounts } = require('../middlewares/auth.middleware');
const { hashPassword } = require('../middlewares/security.middleware');
const { isEmail } = require('../middlewares/users.middleware');
const {
    createUserValidators,
    loginValidators,
    updateUserValidators
} = require('../middlewares/validators.middleware');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, hashPassword, createUser);
usersRouter.post('/login', loginValidators, isEmail, comparePassword, login);
usersRouter.get('/me', protectSession, getProductsUser);
usersRouter.patch('/:id', protectSession, protectUserAcounts, updateUserValidators, updateUser);
usersRouter.delete('/:id', protectSession, protectUserAcounts, disableAcount);
usersRouter.get('/orders', protectSession, getPurchasesUser);
usersRouter.get('/orders/:id', protectSession, getOrderUser);

module.exports = { usersRouter };