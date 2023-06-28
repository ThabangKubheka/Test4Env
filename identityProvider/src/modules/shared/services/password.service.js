const crypto = require('crypto');
const config = require('config');

const secret = config.identityProvider.secret;

module.exports.passwordService = {
  encryptPassword: (password) => {
    return crypto
      .createHmac('sha256', secret)
      .update(password)
      .digest('base64')
  },
  verifyPassWord: (password, encrypted) => {
    const hashedPassword = crypto
      .createHmac('sha256', secret)
      .update(password)
      .digest('base64')
    return hashedPassword === encrypted;
  }
}