const registerRouter = require('express').Router();
const {
  registerService,
} = require('./register.service');
const {
  validateBody
} = require('../../middleware/registerValidation');

registerRouter.post('', validateBody, (req, res) => {
  return registerService.registerUser(req.body)
    .then(() => {
      res.status(200).json({registered: true});
    })
    .catch((error) => {
      if(error.code && error.code === 409) {
        return res.status(409).json({message: error.message});
      }
      return res.status(500).json({message: 'Internal error'});
    })
});

module.exports = {
  registerRouter
}