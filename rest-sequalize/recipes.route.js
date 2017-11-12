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