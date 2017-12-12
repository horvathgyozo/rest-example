const users = require('./users/users.service.js');
const recipes = require('./recipes/recipes.service.js');
const messages = require('./messages/messages.service.js');
const favourites = require('./favourites/favourites.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(users);
  app.configure(recipes);
  app.configure(messages);
  app.configure(favourites);
};
