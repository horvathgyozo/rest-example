/* eslint-disable no-unused-vars */
class Service {
  constructor (options) {
    this.options = options || {};
  }

  async create (data, params) {
    // console.log(params);
    const recipeId = params.recipeId;
    const userId = params.payload.userId;
    const users = this.options.models.users;
    // const recipes = this.options.models.recipes;

    const user = await users.findById(userId);
    // const recipe = await recipes.findById(recipeId);

    // try {
    //   const res = await user.addFavouriteRecipe(recipeId);
    //   // const res = await user.setFavouriteRecipe([recipeId]);
    //   return Promise.resolve(true);
    // }
    // catch (e) {
    //   console.log(e);
    // }

    if (!(await user.hasFavouriteRecipe(recipeId))) {
      const res = await user.addFavouriteRecipe(recipeId);
    }
    return Promise.resolve(true);
  }

  async remove (id, params) {
    const recipeId = params.recipeId;
    const userId = params.payload.userId;
    const users = this.options.models.users;

    const user = await users.findById(userId);

    const res = await user.removeFavouriteRecipe(recipeId);

    return Promise.resolve(true);
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
