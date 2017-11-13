const express = require('express');
const router = express.Router();
const Recipe = require('./recipe.model');

router
    .get('/',       (req, res) => {
        Recipe.findAll().then(recipes => {
            res.send(recipes);
        })
    })
    .get('/:id',    (req, res) => res.send("Get one recipes"))
    .post('/',      (req, res) => res.send("Add new recipe"))
    .put('/:id',    (req, res) => res.send("Modify a recipes"))
    .patch('/:id',  (req, res) => res.send("Modify part of a recipes"))
    .delete('/:id', (req, res) => res.send("Delete all recipes"))
    .delete('/:id', (req, res) => res.send("Delete recipe"));

module.exports = router