const express = require('express');

// Utils
const { upload } = require('../utils/upload.util');

// Controllers
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    disableProduct,
    getAllCategories,
    createCategory,
    updateCategory
} = require('../controllers/products.controller');

const { isProduct } = require('../middlewares/products.middlewares');

// Middlewares
const { protectSession, protectUserAcounts } = require('../middlewares/auth.middleware');
const { createProdutValidators, createCategorieValidators } = require('../middlewares/validators.middleware');
const { isCategory } = require('../middlewares/categories.middleware');

const productsRouter = express.Router();

productsRouter.post('/', upload.array('productImg', 5), protectSession, isCategory, createProdutValidators, createProduct);
productsRouter.get('/', getAllProducts);
productsRouter.get('/categories', getAllCategories);
productsRouter.post('/categories', protectSession, createCategorieValidators, createCategory);
productsRouter.patch('/categories/:id', protectSession, isCategory, updateCategory);
productsRouter.get('/:id', isProduct, getProductById);
productsRouter.patch('/:id', protectSession, isProduct, protectUserAcounts, updateProduct);
productsRouter.delete('/:id', protectSession, isProduct, protectUserAcounts, disableProduct);

module.exports = { productsRouter };