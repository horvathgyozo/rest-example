// Initializes the `favourites` service on path `/favourites`
const createService = require('./favourites.class.js');
const hooks = require('./favourites.hooks');
const filters = require('./favourites.filters');

module.exports = function () {
  const app = this;
  const paginate = app.get('paginate');

  const options = {
    name: 'favourites',
    paginate,
    models: app.get('sequelizeClient').models
  };

  // Initialize our service with any options it requires
  app.use('/favourites/:recipeId', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('favourites/:recipeId');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
