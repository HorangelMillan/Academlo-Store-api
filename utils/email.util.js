const nodemailer = require('nodemailer');
require('dotenv').config();
const pug = require('pug');
const path = require('path');
const { htmlToText } = require('html-to-text');

class Email {
    constructor(to) {
        this.to = to;
    };

    // Connect to mail service
    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            // Connect to AWS SES
            return nodemailer.createTransport({
                from: process.env.EMAIL_FROM,
                host: process.env.SES_HOST,
                port: process.env.SES_PORT,
                auth: {
                    user: process.env.SES_USERNAME,
                    pass: process.env.SES_PASSWORD,
                }
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