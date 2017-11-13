const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipe.controller');

router
    .get('/',       recipeController.findAll)
    .get('/:id',    recipeController.findById)
    .post('/',      recipeController.add)
    .put('/:id',    (req, res) => res.send("Modify a recipes"))
    .patch('/:id',  (req, res) => res.send("Modify part of a recipes"))
    .delete('/:id', (req, res) => res.send("Delete all recipes"))
    .delete('/:id', (req, res) => res.send("Delete recipe"));

module.exports = router