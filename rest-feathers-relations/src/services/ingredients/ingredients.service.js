// Initializes the `ingredients` service on path `/ingredients`
const createService = require('feathers-sequelize');
const createModel = require('../../models/ingredients.model');
const hooks = require('./ingredients.hooks');
const filters = require('./ingredients.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'ingredients',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/ingredients', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('ingredients');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
