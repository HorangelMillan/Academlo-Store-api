const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const databaseService = {
    database: process.env.RDS_DATABASE,
    username: process.env.MASTER_USERNAME,
    password: process.env.MASTER_PASSWORD,
    host: process.env.RDS_LINKPOINT,
    port: process.env.RDS_PORT,
    dialect: 'mysql',
    dialectOptions: process.env.NODE_ENV === 'production' ?
        {
            ssl: {
                required: true,
                rejectUnauthorized: false,
            },
        } : {},
    logging: false
}

const databaseDev = {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    logging: false
}

const db = new Sequelize(
    process.env.NODE_ENV === 'development' ? databaseDev : databaseService
);

module.exports = { db, DataTypes };