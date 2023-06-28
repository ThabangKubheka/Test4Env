const playerRouter = require('express').Router();
const {
  playerService,
} = require('./player.service');

const {
  auth
} = require('../../middleware/authValidation');

playerRouter.post('', auth, (req, res) => {
  res.status(200).json({})
});

playerRouter.get('/getScore', auth, async (req, res) => {
  let name = res.locals.user.username;
  return playerService.fetchUserScore(name)
    .then(data => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({error});
    })
});

module.exports = {
  playerRouter
}