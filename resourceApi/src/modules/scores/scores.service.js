const {
    fetchAllScores,postScore
} = require('../../database/resourceApiDAL');

module.exports.scoresService = {
    fetchAllScores: () => {
        return fetchAllScores()
        .then((data) => {
            return data;
        });
    },

    postScore: async (scoreDetails) => {
        try{
        const {username, state} = scoreDetails;
        return await postScore(username,state);
        }catch(error){
            throw error;
        }
    },
}
