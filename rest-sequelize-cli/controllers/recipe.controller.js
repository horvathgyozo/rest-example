const models = require('../models');

module.exports = {
  async findAll(req, res) {
    const recipes = await models.Recipe.findAll();
    res.send(recipes);
  },
  async findById(req, res) {
    const id = req.params.id;
    const recipe = await models.Recipe.findById(id);
    res.send(recipe);
  },
  async add(req, res) {
    const data = req.body;
    const recipe = await models.Recipe.create(data);
    res.send(recipe);
  }
};