const nodemailer = require('nodemailer');
require('dotenv').config();
const pug = require('pug');
const path = require('path');
const AWS = require('aws-sdk');
const { htmlToText } = require('html-to-text');

AWS.config.update({
    accessKeyId: process.env.SES_USER,
    secretAccessKey: process.env.SES_PASSWORD,
    region: 'us-east-1'
});

class Email {
    constructor(to) {
        this.to = to;
    };

    // Connect to mail service
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Connect to AWS SES
            return nodemailer.createTransport({
                SES: new AWS.SES({
                    apiVersion: '2012-10-17'
                })
            });
        };

        return nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASSWORD,
            },
        });
    };

    // Send the actual mail
    async send(template, subject, mailData) {
        const html = pug.renderFile(
            path.join(__dirname, '..', 'views', 'emails', `${template}.pug`),
            mailData
        );

        await this.newTransport().sendMail({
            from: process.env.MAIL_FROM,
            to: this.to,
            subject,
            html,
            text: htmlToText(html),
        });
    };

    async sendWelcome(name) {
        await this.send('welcome', 'Welcome to our app', { name });
    };

    async sendNewPurchase(purchases, totalPrice) {
        await this.send('purchase', 'You have created a new post', {
            purchases,
            totalPrice
        });
    }
};

module.exports = { Email };