require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('./logger');

async function send(recipients, subject, body, senders) {
  nodemailer.createTestAccount((err, account) => {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      }
    });

    const mailOptions = {
      from: senders ? senders : '"dTorrent" <maxime.maillet93@gmail.com>',
      to: recipients,
      subject: subject,
      html: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        logger.write({
          location: 'mailer',
          error
        }, logger.LEVEL.ERROR);
      }
    });
  });
}

module.exports = {
  send,
};