const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require("fs");

const key = fs.readFileSync(config.resourceApi.key)

module.exports.tokenService = {
  verifyToken:(token) => {
    return jwt.verify(
      token,
      key,
      {
        audience: 'RPS_API',
        issuer: 'RPS_ID'
      }
    );
  }
}