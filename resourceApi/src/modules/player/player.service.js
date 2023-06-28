const {
    fetchUserScore
} = require('../../database/resourceApiDAL');

module.exports.playerService = {
    fetchUserScore: (username) => {
        return fetchUserScore(username)
        .then((data) => {
            return data;
        });
    }
}