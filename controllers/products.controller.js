const { ref, uploadBytes } = require('firebase/storage');

// Models
const { Products } = require('../models/product.model');
const { Categories } = require('../models/category.model');
const { ProductImgs } = require('../models/productImg.model');

// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { storage } = require('../utils/firebase.util');

const createProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, quantity, categoryId, user } = req.body;


    const createdProduct = await Products.create({
        title,
        description,
        price,
        quantity,
        userId: user.id,
        categoryId
    });

    if (req.files.length > 0) {
        const filesPromises = req.files.map(async file => {
            const imgRef = ref(storage, `products/${Date.now()}_${file.originalname}`);
            const imgRes = await uploadBytes(imgRef, file.buffer);

            return await ProductImgs.create({
                productId: createdProduct.id,
                imgUrl: imgRes.metadata.fullPath,
            });
        });

        await Promise.all(filesPromises);
    }

    res.status(200).json({
        status: 'success',
        createdProduct
    });
});

const getAllProducts = catchAsync(async (req, res, next) => {
    const products = await Products.findAll({
        where: {
            status: 'active'
        }
    });

    res.status(200).json({
        status: 'success',
        products
    });
});

const getProductById = catchAsync(async (req, res, next) => {
    const { product } = req.body;

    res.status(200).json({
        status: 'success',
        product
    });
});

const updateProduct = catchAsync(async (req, res, next) => {
    const { title, description, price, quantity, product } = req.body;

    await Products.update({
        title,
        description,
        quantity,
        price
    }, {
        where: {
            id: product.id
        }
    });

    res.status(200).json({
        status: 'success',
    });
});

const disableProduct = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    await Products.update({
        status: 'disabled'
    }, {
        where: {
            id
        }
    });

    res.status(200).json({
        status: 'success',
    });
});

const getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Categories.findAll({
        where: {
            status: 'active'
        }
    });

    res.status(200).json({
        status: 'success',
        categories
    });
});

const createCategory = catchAsync(async (req, res, next) => {
    const { name } = req.body;

    const createdCategory = await Categories.create({
        name
    });

    res.status(200).json({
        status: 'success',
        createdCategory
    });
});

const updateCategory = catchAsync(async (req, res, next) => {
    const { category, name } = req.body;

    await Categories.update({
        name
    }, {
        where: {
            id: category.id
        }
    });

    res.status(200).json({
        status: 'success',
    });
});

module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    disableProduct,
    getAllCategories,
    createCategory,
    updateCategory
};