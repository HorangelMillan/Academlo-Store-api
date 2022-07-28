const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const { default: rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const path = require('path');

// Routers
const { usersRouter } = require('./routes/users.routes');
const { cartsRouter } = require('./routes/carts.routes');
const { productsRouter } = require('./routes/products.routes');

// Contorllers
const { globalErrorHandler } = require('./controllers/error.controller');

// Utils
const { AppError } = require('./utils/appError.util');

// Init express
const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('combined'));
} else {
    app.use(morgan('dev'));
};

// Set template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '/views'));

app.use(rateLimit({
    max: 10000,
    windowMs: 60 * 60 * 1000,
    message: 'number of request have been exceeded'
}));

// Main routes
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/carts', cartsRouter);
app.use('/api/v1/products', productsRouter);


// Handle uknown routes
app.all('*', (req, res, next) => {
    next(new AppError(`${req.method} ${req.originalUrl} not found in this server`, 404));
});

// Global Error Handler
app.use(globalErrorHandler);

module.exports = { app };