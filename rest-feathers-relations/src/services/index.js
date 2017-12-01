const recipes = require('./recipes/recipes.service.js');
const ingredients = require('./ingredients/ingredients.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(recipes);
  app.configure(ingredients);
};
