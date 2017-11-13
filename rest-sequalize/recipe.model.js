const Sequelize = require('sequelize');

const sequelize = new Sequelize('sqlite://db.sqlite');

const Recipe = sequelize.define('recipe', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  ingredients: Sequelize.TEXT,
  img_url: Sequelize.STRING
});

module.exports = Recipe;