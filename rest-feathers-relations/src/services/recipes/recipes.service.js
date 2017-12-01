// Initializes the `recipes` service on path `/recipes`
const createService = require('feathers-sequelize');
const createModel = require('../../models/recipes.model');
const hooks = require('./recipes.hooks');
const filters = require('./recipes.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'recipes',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/recipes', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('recipes');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
