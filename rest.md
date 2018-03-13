# REST API with Node.js

## Table of contents

- REST API
- Testing
- Manual REST API
- Semi-manual REST API with `sequelize-cli`
- Automatic REST API with Feathers.js

## REST API

Representational State Transfer (REST) Application Programming Interface (API)

* Data access through HTTP protocol
* CRUD operations on data source
* with HTTP methods (`GET`, `POST`, `DELETE`, `PUT/PATCH`)
* request/response (generally) in JSON format

## REST API example

* `GET /people`: querying all `people`
* `GET /people/john`: querying an element with `john` identifier from model `people`
* `POST /people`: Inserting new element into `people` model
* `PUT /people/john`: Updating element with `john` identifier in model `people`
* `PATCH /people/john`: Partially updating element with `john` identifier in model `people`
* `DELETE /people`: Deleting all elements from model `people`
* `DELETE /people/john`: Deleting element with `john` identifier from model `people`

## REST interface for CRUD

Representational State Transfer

```
create  → POST   /collection
read    → GET    /collection[/id]
update  → PUT    /collection/id
patch   → PATCH  /collection/id
delete  → DELETE /collection[/id]
```

## Testing

Tools:

* Endpoint tester for Chrome: [Advanced REST Client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo?utm_source=chrome-app-launcher-info-dialog)
* Endpoint tester for Firefox: [REST Easy](https://addons.mozilla.org/hu/firefox/addon/rest-easy/?src=search)

Manual tests:

* create a new element in the database with a `POST` method
* query all elements with a `GET` method
* select one element with a `GET` method
* update/delete an element with `PUT` and `DELETE` methods

## Task

Make a REST API for managing recipe entities! Use [`express`](http://expressjs.com/) for handling HTTP request and routing, and store the item in a SQLite database with [`sequelize`](http://docs.sequelizejs.com/manual/installation/getting-started.html) ORM!

```txt
GET    /recipes
GET    /recipes/id
POST   /recipes
PUT    /recipes/id
PATCH  /recipes/id
DELETE /recipes
DELETE /recipes[/id]
```

## Creating a REST interface manually

### Preparing the application

Create a new directory, and a `package.json` file inside:

```json
{
  "scripts": {
    "dev": "nodemon server.js"
  }
}
```

Install the necessary dependencies:

```txt
npm i --save express sequelize sqlite3
npm i --save-dev nodemon
```

### Basic express application

`server.js`

```js
const express = require('express');
const app = express();

app.listen(3000, () => console.log('Example app listening on port 3000!'));
```

Start the application with:

```txt
npm run dev
```

### REST API routes

Our Recipe API will be under `/recipe` endpoint. We make a separate router for handling those endpoints in `recipes.router.js`:

```js
var express = require('express');
var router = express.Router();

router
    .get('/',       (req, res) => res.send("Get all recipes"))
    .get('/:id',    (req, res) => res.send("Get one recipes"))
    .post('/',      (req, res) => res.send("Add new recipe"))
    .put('/:id',    (req, res) => res.send("Modify a recipes"))
    .patch('/:id',  (req, res) => res.send("Modify part of a recipes"))
    .delete('/:id', (req, res) => res.send("Delete all recipes"))
    .delete('/:id', (req, res) => res.send("Delete recipe"));

module.exports = router
```

We attach this router as a middleware in our express application (`server.js`):

```js
const recipeRouter = require('./recipes.route.js')
app.use('/recipes', recipeRouter);
```

### The recipe model

Sequelize -- like every ORM -- uses models to interact with the database. First we need to define the connection towards the database, and then we define a `Recipe` model in `recipe.model.js`:

```js
const Sequelize = require('sequelize');
const sequelize = new Sequelize('sqlite://db.sqlite');

const Recipe = sequelize.define('recipe', {
  title: Sequelize.STRING,
  description: Sequelize.TEXT,
  ingredients: Sequelize.TEXT
});

module.exports = Recipe;
```

Starting the application first we need to connect to the database and create (synchronize the models with) the table structure, and then starting the web server (`server.js`):

```js
const Recipe = require('./recipe.model');

// ...

async function start() {
  await Recipe.sync({force: true});
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
}

start();
```

### Using the Recipe model

Sequelize ensures high-level methods for handling Recipe objects. We will use these methods in our endpoint routers (`recipes.router.js`):

```js
router
    .get('/',    async (req, res) => {
        const recipes = await Recipe.findAll();
        res.send(recipes);
    })
    .get('/:id', async (req, res) => {
        const id = req.params.id;
        const recipe = await Recipe.findById(id);
        res.send(recipe);
    })
    .post('/',   async (req, res) => {
        const data = req.body;
        const recipe = await Recipe.create(data);
        res.send(recipe);
    })
```

For handling request body we need to use `app.use(express.json());` in `server.js`.

### Separate routing and controller functions (optional)

We will introduce a controller to separate the routing functionality from the processing functionality. Make a new file called `recipes.controller.js` and move the handler methods from the router into the controller:

```js
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
```

Now the router only needs the controller as a dependency, and it just maps the requests to controller methods:

```js
const recipeController = require('./recipe.controller');

router
    .get('/',       recipeController.findAll)
    .get('/:id',    recipeController.findById)
    .post('/',      recipeController.add)
```

### Further tasks

Implement the remaining endpoints!



## Using Sequelize CLI

We can speed up the model definition process by using the Sequelize CLI. For this we need to install it locally:

```txt
npm install --save-dev sequelize-cli
```

Now you will have a local `sequelize` command, which you can use in this way:

```txt
node_modules\.bin\sequelize
```

After having a basic express application with the static recipes routes, we can initialize the files for sequelize.

```txt
node_modules\.bin\sequelize init
```

It will create a `config` and a `models` directory with some default files in it. We need to set up SQLite in `config.json`:

```json
"development": {
    "username": "root",
    "password": null,
    "database": "recipes",
    "dialect": "sqlite",
    "storage": "db.sqlite"
}
```

In `models/index.js` we need to repair the row, where we import the config data:

```js
var config    = require(__dirname + '/../config/config.json')[env];
```

The next step is to generate the Recipe model with the [CLI](https://github.com/sequelize/cli#usage:

```txt
node_modules\.bin\sequelize model:generate --name Recipe --attributes title:string
```

It will create a new file `models/recipe.js`. Make modifications for your need:

```js
// ...
{
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    ingredients: DataTypes.TEXT
}
// ...
```

In `server.js` we can synchronize our models in the following way:

```js
const models = require('./models');

async function start() {
  await models.sequelize.sync();
  app.listen(3000, () => console.log('Example app listening on port 3000!'));
}
```

Finally use the models in the controller as well:

```js
const models = require('../models');

module.exports = {
  async findAll(req, res) {
    const recipes = await models.Recipe.findAll();
    res.send(recipes);
  }
  // ...
};
```

## Making REST API with a high-level tool

There many tools that can generate REST API, we will use [Feathers.js](https://feathersjs.com/) for this purpose. Feathers.js has a very nice and clean philosophy, it has server and client side libraries for interchanging information. We will not go deep here, but you can [read the guides](https://docs.feathersjs.com/) and other documentation on Feathers website. Furthermore, we will use [Feathers CLI](https://docs.feathersjs.com/guides/step-by-step/generators/readme.html) for quickly creating a working REST interface. We will use SQLite and Sequelize in this example, too.

### Preparations

First we need to install `feathers-cli` globally:

```txt
npm install -g feathers-cli
```

It will create a global `feathers` command which you can use in the command line.

**Note:**
In the computer labs the folder of the global npm packages is not in the PATH variable, so we have to use the `feathers` command with an absolute path:

```txt
c:\Users\<username>\AppData\Roaming\npm\feathers
```

### Generate the application

Make a new folder, and *in* the folder generate a new feathers application:

```sh
mkdir rest-feathers
cd rest-feathers
# Normally
feathers generate app
# In computer labs
c:\Users\<username>\AppData\Roaming\npm\feathers generate app
```

### Add Sequelize support

For [using Sequelize in Feathers](https://docs.feathersjs.com/api/databases/sequelize.html) we need to install the necessary modules:

```txt
npm install --save feathers-sequelize sqlite3
```

### Generate the `recipes` service

```txt
feathers generate service
# In computer labs
c:\Users\<username>\AppData\Roaming\npm\feathers generate service
```

### Start the application

```txt
npm start
```

And you have a working REST API for the recipes.


## Further help

You can follow the evolution of these steps in [this git repository](https://github.com/horvathgyozo/rest-example). Use `gitk` command for reviewing the changes in the commits.

