const { Users } = require('../models/user.model');
const { Products } = require('../models/product.model');
const { Carts } = require('../models/cart.model');
const { Categories } = require('../models/category.model');
const { Orders } = require('../models/order.model');
const { ProductImgs } = require('../models/productImg.model');
const { ProductsInCart } = require('../models/productsInCart.model');

const relateModels = () => {
    Users.hasMany(Products, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        }
    });
    Products.belongsTo(Users);

    Users.hasMany(Orders, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        }
    });
    Orders.belongsTo(Users);

    Users.hasOne(Carts, {
        foreignKey: {
            name: 'userId',
            allowNull: false
        }
    });
    Carts.belongsTo(Users);

    Carts.hasOne(Orders, {
        foreignKey: {
            name: 'cartId',
            allowNull: false
        }
    });
    Orders.belongsTo(Carts);

    Carts.hasMany(ProductsInCart, {
        foreignKey: {
            name: 'cartId',
            allowNull: false
        }
    });
    ProductsInCart.belongsTo(Carts);

    Products.hasOne(ProductsInCart, {
        foreignKey: {
            name: 'productId',
            allowNull: false
        }
    });
    ProductsInCart.belongsTo(Products);

    Categories.hasOne(Products, {
        foreignKey: {
            name: 'categoryId',
            allowNull: false
        }
    });
    Products.belongsTo(Categories);

    Products.hasMany(ProductImgs, {
        foreignKey: {
            name: 'productId',
            allowNull: false
        }
    });
    ProductImgs.belongsTo(Products);
};

module.exports = { relateModels };