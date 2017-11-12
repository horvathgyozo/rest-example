const express = require('express');
const app = express();
const recipeRouter = require('./recipes.route.js')

app.use('/recipes', recipeRouter);

app.listen(3000, () => console.log('Example app listening on port 3000!'));