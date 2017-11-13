const express = require('express');
const models = require('./models');

const app = express();
app.use(express.json());

async function start() {
  await models.sequelize.sync();
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
}

start();