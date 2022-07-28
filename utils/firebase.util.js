const { initializeApp } = require('firebase/app');
const { getStorage } = require('firebase/storage');
require('dotenv').config();

const firebaseConfig = {
    apiKey: process.env.FB_APIKEY,
    authDomain: process.env.FB_AUTHDOMAIN,
    projectId: process.env.FB_PROJECTID,
    storageBucket: process.env.FB_STORAGEBUCKET,
    messagingSenderId: process.env.FB_MSGSEND,
    appId: process.env.FB_APID
};

// init firebase app
const firebaseApp = initializeApp(firebaseConfig);

const storage = getStorage(firebaseApp);

module.exports = { storage };