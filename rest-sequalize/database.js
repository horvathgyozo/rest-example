const Recipe = require('./recipe.model');

async function seed() {
  return await Promise.all([
    Recipe.create({
      title: 'Gulash soup',
      description: 'desc1',
      ingredients: 'ingr1'
    }),
    Recipe.create({
      title: 'Túrós csusza',
      description: 'desc2',
      ingredients: 'ingr2'
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

module.exports = {
  start
}