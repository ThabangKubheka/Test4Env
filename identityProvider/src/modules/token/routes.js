const tokenRouter = require('express').Router();
const {
  tokenAuthService,
} = require('./token.service');

tokenRouter.get('', (req, res) => {
  const { accesstoken, refreshtoken } = req.headers
  console.log('You made it');
  return tokenAuthService.getNewAccessToken(refreshtoken, accesstoken)
    .then(({accessToken, refreshToken}) => {
      res.set('AccessToken', accessToken)
      res.set('RefreshToken', refreshToken)
      res.header("Access-Control-Expose-Headers","AccessToken, RefreshToken");
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
  tokenRouter
}