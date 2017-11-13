const express = require('express');
const models = require('./models');
const recipeRouter = require('./routes/recipes.route');

const app = express();

app.use(express.json());
app.use('/recipes', recipeRouter);

async function start() {
  await models.sequelize.sync();
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
}

start();