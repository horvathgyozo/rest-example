const Recipe = require('./recipe.model');

module.exports = {
  async findAll(req, res) {
    const recipes = await Recipe.findAll();
    res.send(recipes);
  },
  async findById(req, res) {
    const id = req.params.id;
    const recipe = await Recipe.findById(id);
    res.send(recipe);
  },
  async add(req, res) {
    const data = req.body;
    const recipe = await Recipe.create(data);
    res.send(recipe);
  }
};