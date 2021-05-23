'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const ingredientSchema = Schema({
  amount: Number,
  unit: String,
  name: String
});

module.exports = Mongoose.model('Ingredient', ingredientSchema);