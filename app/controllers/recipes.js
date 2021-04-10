'use strict';

const User = require('../models/user');
const Recipe = require('../models/recipe');

const Recipes = {
    home: {
        handler: function(request, h) {
            return h.view('hom' +
                '..............................................................................e', { title: 'Add a Recipe' });
        }
    },
    report: {
        handler: async function(request, h) {
            const recipes = await Recipe.find().populate('member').lean();
            console.log("This is  achange to commit")
            return h.view('report', {
                title: 'Recipes to Date',
                recipes: recipes
            });
        }
    },
    addRecipe: {
        handler: async function(request, h) {
            const id = request.auth.credentials.id;
            const user = await User.findById(id);
            const data = request.payload;
            const newRecipe = new Recipe({
                name: data.name,
                description: data.description,
                member: user._id
            });
            await newRecipe.save();
            return h.redirect('/report');
        }
    },
};

module.exports = Recipes;