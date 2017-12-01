

const includeIngredientsInRecipe = require('../../hooks/include-ingredients-in-recipe');

module.exports = {
  before: {
    all: [],
    find: [includeIngredientsInRecipe()],
    get: [includeIngredientsInRecipe()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
