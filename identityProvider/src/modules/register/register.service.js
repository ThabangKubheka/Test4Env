const {
    passwordService,
} = require('../shared/services');

const {
    addUser,
    addPlayer
} = require('../../database/identityProviderDAL');


module.exports.registerService = {
    registerUser: async (userDetails) => {
        const {username, email, password} = userDetails;
        const hashedPassword = passwordService.encryptPassword(password);
        return addUser(username, email, hashedPassword)
            .then(user => {
                return addPlayer(username)
                    .then(() => {
                        return user;
                    })
            })
            .catch(error => {
                return Promise.reject({code: 409, message:'User exists'})
            })
    }
}