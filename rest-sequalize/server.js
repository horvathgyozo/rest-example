const express = require('express');
const app = express();
const recipeRouter = require('./recipes.route.js');
const database = require('./database');

app.use('/recipes', recipeRouter);

async function start() {
  await database.start();
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
}

start();