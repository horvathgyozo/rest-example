const Sequelize = require('sequelize');

const sequelize = new Sequelize('sqlite://db.sqlite');

const Recipe = sequelize.define('recipe', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  ingredients: Sequelize.TEXT,
  img_url: Sequelize.STRING
});

async function seed() {
  return await Promise.all([
    Recipe.create({
      firstName: 'John',
      lastName: 'Hancock'
    }),
    Recipe.create({
      firstName: 'John2',
      lastName: 'Hancock2'
    })
  ]);
}

// force: true will drop the table if it already exists
async function start() {
  try {
    await Recipe.sync({force: true});
    const inserted = await seed();
    return inserted;
  }
  catch (e) {
    console.log(e);
  }
}
start();