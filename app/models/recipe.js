'use strict';

const Mongoose = require('mongoose');
const Schema = Mongoose.Schema;

const recipeSchema = new Schema({
    name: String,
    description: String,
    member: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = Mongoose.model('Recipe', recipeSchema);