const {
    passwordService,
    tokenService
} = require('../shared/services');

const {
  fetchUser
} = require('../../database/identityProviderDAL');

module.exports.loginService = {
  loginUser: (userDetails) => {
    const threeMin = '3 min';
    const tenMin = '10m';
    const {email, password} = userDetails;
    const hashedPassword = passwordService.encryptPassword(password);
    return fetchUser(email, hashedPassword)
      .then(({ username }) => {
        const accessToken = tokenService.createToken({username}, threeMin);
        const refreshToken = tokenService.createToken({username}, tenMin);
    
        return {accessToken, refreshToken}

      })
      .catch(error => {
        if(error.code && error.code === 404) {
          return Promise.reject(error)
        }
        return Promise.reject({code: 500, message: 'Internal error'})
      });
  }
}