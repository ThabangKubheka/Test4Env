const loginRouter = require('express').Router();
const {
  loginService,
} = require('./login.service');

const {
  validateBody
} = require('../../middleware/loginValidation');

loginRouter.post('', validateBody, (req, res) => {
  return loginService.loginUser(req.body)
    .then(({accessToken, refreshToken}) => {
      res.set('Authorization', 'Bearer '+ accessToken)
      res.set('RefreshToken', 'BearerRef '+refreshToken)
      res.header("Access-Control-Expose-Headers","Authorization, RefreshToken");
      res.status(200).json({})
    })
    .catch(error => {
      if(error.code) {
        return res.status(error.code).json({message: error.message});
      }
      return res.status(500).json({message: 'Internal error'});
    })
});

module.exports = {
  loginRouter
}