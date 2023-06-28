const {
  loginRouter,
} = require('./modules/login/routes');
const {
  playerRouter,
} = require('./modules/player/routes');
const {
  registerRouter,
} = require('./modules/register/routes');
const {
  scoresRouter,
} = require('./modules/scores/routes');

module.exports = {
  loginRouter,
  playerRouter,
  registerRouter,
  scoresRouter
}