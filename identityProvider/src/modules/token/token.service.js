const {
    passwordService,
    tokenService
} = require('../shared/services');

const {
    fetchUserByUserName
} = require('../../database/identityProviderDAL');

module.exports.tokenAuthService = {
    getNewAccessToken: (refreshToken, accessToken) => {
        const threeMin = '3 min';
        try {
            const refreshData = tokenService.verifyToken(refreshToken)
            const accessData = tokenService.decode(accessToken);
            if(refreshData.user.username === accessData.user.username) {
                return fetchUserByUserName(refreshData.user.username)
                    .then(username => {
                        const newAccessToken = tokenService.createToken({username}, threeMin)
                        return {accessToken: newAccessToken, refreshToken}
                    })
            }
            throw new Error()
        } catch (error) {
            return Promise.reject({code:401, message: 'Invalid Tokens'})
        }

    },
    loginUser: (userDetails) => {
        const {email, password} = userDetails;
        const hashedPassword = passwordService.encryptPassword(password);
        return fetchUser(email, hashedPassword)
          .then(({ username }) => {
        
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