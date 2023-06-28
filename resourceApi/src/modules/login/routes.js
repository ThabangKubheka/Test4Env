const loginRouter = require('express').Router();
const {
  loginService,
} = require('./login.service');

const {
  auth
} = require('../../middleware/authValidation');

loginRouter.post('', auth, (req, res) => {
  const user = res.locals.user;
  console.log(user);
  res.status(200).json({})
});

module.exports = {
  loginRouter
}