const jwt = require('jsonwebtoken');
const config = require('config');
const fs = require("fs");

const audience = 'RPS_API';
const issuer = 'RPS_ID';

const key = fs.readFileSync(config.identityProvider.key)
const apiKey = fs.readFileSync(config.resourceApi.key)

module.exports.tokenService = {
  createToken: (user, time) => {
    return jwt.sign(
      {
        user
      },
      key,
      {
        algorithm: 'RS256',
        expiresIn: time,
        audience,
        issuer,
      }
    );
  },
  decode: (token) => {
    return jwt.decode(token);
  },
  verifyToken:(token) => {
    return jwt.verify(
      token,
      apiKey,
      {
        audience,
        issuer
      }
    );
  }
}