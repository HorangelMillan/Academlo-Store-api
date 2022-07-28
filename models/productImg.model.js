const { db, DataTypes } = require('../utils/database.util');

const ProductImgs = db.define('productImgs', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'active'
    }
});

module.exports = { ProductImgs };