const { app } = require('./app');
const { db } = require('./utils/database.util');
const { relateModels } = require('./models/relation.model');
require('dotenv').config();

const initServer = async () => {
    await db.authenticate()
        .then(() => console.log('databse is authenticated'))
        .catch(err => console.log(err));

    relateModels();

    await db.sync()
        .then(() => console.log('database models is synced'))
        .catch(err => console.log(err));

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port: ${process.env.PORT}`);
    });
};

initServer();



