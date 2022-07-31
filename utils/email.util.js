const nodemailer = require('nodemailer');
require('dotenv').config();
const pug = require('pug');
const path = require('path');
const { htmlToText } = require('html-to-text');
const aws = require('@aws-sdk/client-ses');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');

const ses = new aws.SES({
    credentials: {
        accessKeyId: process.env.S3_ID,
        secretAccessKey: process.env.S3_SECRET
    },
    apiVersion: '2012-10-17',
    region: 'us-east-1',
    defaultProvider
});

class Email {
    constructor(to) {
        this.to = to;
    };

    // Connect to mail service
    newTransport() {
        if (process.env.NODE_ENV === "production") {
            return nodemailer.createTransport({
                SES: {
                    ses,
                    aws
                }
            })
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
            path.join(__dirname, `../views/emails/${template}.pug`),
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
        await this.send('welcome', 'Welcome to our e-commerce', { name });
    };

    async sendNewPurchase(purchases, totalPrice) {
        await this.send('purchase', 'You have a new purchase', {
            purchases,
            totalPrice
        });
    };
};

module.exports = { Email };