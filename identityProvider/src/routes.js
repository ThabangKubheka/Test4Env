const {
  loginRouter,
} = require('./modules/login/routes');
const {
  registerRouter
} = require('./modules/register/routes');
const {
  tokenRouter
} = require('./modules/token/routes');

module.exports = {
  loginRouter,
  registerRouter,
  tokenRouter,
}