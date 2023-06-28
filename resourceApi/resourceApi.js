const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require("body-parser");
const config = require('config');

const {
  loginRouter,
  playerRouter,
  registerRouter,
  scoresRouter
} = require('./src/routes');

const app = express();
const resourceApiConfig = config.resourceApi;
const port = resourceApiConfig.port;


app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());

app.use('/', express.static(path.join('web')));

app.use('/api/login', loginRouter);
app.use('/api/player', playerRouter);
app.use('/api/register', registerRouter);
app.use('/api/scores', scoresRouter);

app.listen(port);
console.log(`http://localhost:${port}`);