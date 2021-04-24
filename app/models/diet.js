'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const dietSchema = Schema({
  name: String
});

module.exports = Mongoose.model('Diet', dietSchema);