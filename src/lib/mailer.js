require('dotenv').config();
const nodemailer = require('nodemailer');
const logger = require('./logger');
const config = require('../config');

module.exports.send = (recipients, subject, body, senders) => {
  return new Promise((resolve, reject) => {
    nodemailer.createTestAccount((err, account) => {
      if(err) {
        reject(err);
      } else {
        const transporter = nodemailer.createTransport({
          host: config.mailer.host,
          port: config.mailer.port,
          secure: true,
          auth: {
            user: config.mailer.user,
            pass: config.mailer.password,
          }
        });
        const mailOptions = {
          from: senders ? senders : config.mailer.sender,
          to: recipients,
          subject: subject,
          html: body
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            logger.write({location: 'mailer', error}, logger.LEVEL.ERROR);
            reject(error);
          } else {
            resolve(info);
          }
        });
      }
    });
  });
};