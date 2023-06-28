const registerRouter = require('express').Router();
const {
  registerService,
} = require('./register.service');

const {
  auth
} = require('../../middleware/authValidation');

registerRouter.post('', auth, (req, res) => {
  res.status(200).json({})
});

module.exports = {
  registerRouter
}