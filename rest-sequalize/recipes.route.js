const express = require('express');
const router = express.Router();
const Recipe = require('./recipe.model');

router
    .get('/',       async (req, res) => {
        const recipes = await Recipe.findAll();
        res.send(recipes);
    })
    .get('/:id',    async (req, res) => {
        const id = req.params.id;
        const recipe = await Recipe.findById(id);
        res.send(recipe);
    })
    .post('/',      async (req, res) => {
        const data = req.body;
        const recipe = await Recipe.create(data);
        res.send(recipe);
    })
    .put('/:id',    (req, res) => res.send("Modify a recipes"))
    .patch('/:id',  (req, res) => res.send("Modify part of a recipes"))
    .delete('/:id', (req, res) => res.send("Delete all recipes"))
    .delete('/:id', (req, res) => res.send("Delete recipe"));

module.exports = router