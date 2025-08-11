const sendEmail = require('./emailService');

const sendEmailFun = async (to, subject, text, html) => {
    const result = await sendEmail(to, subject, text, html);
    return result.success;
};

module.exports = sendEmailFun;