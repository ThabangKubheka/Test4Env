const scoresRouter = require("express").Router();
const { scoresService } = require("./scores.service");
const {
  auth
} = require('../../middleware/authValidation');

scoresRouter.get('', (req, res) => {
  res.status(200).json({})
});

scoresRouter.get("/getScores", async (req, res) => {
  return scoresService.fetchAllScores()
    .then(data => {
      return res.status(200).json(data);
    })
    .catch((error) => {
      return res.status(500).json({error});
    })
});


scoresRouter.post("/postScore", auth, (req, res) => {
  const user = res.locals.user;
  if (!user || !user.username) {
    res.status(200).json({message: 'No score updated for none user.'})
  }
  return scoresService.postScore({state: req.body.state, username: user.username})
  .then(() => {
    res.status(201).json({});
  })
  .catch((error) => {
    return res.status(500).json({error});
  })
});

module.exports = {
  scoresRouter
}