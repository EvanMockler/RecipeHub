'use strict';

const User = require('../models/user');
const Recipe = require('../models/recipe');
const ImageStore = require('../utils/image-store');
const Diet = require('../models/diet')

const Recipes = {
    home: {
        handler: async function(request, h) {
            const diets = await Diet.find().lean();
            return h.view('home',
                 { title: 'Add a Recipe', diets: diets});
        }
    },
    report: {
        handler: async function(request, h) {
            const recipes = await Recipe.find().populate('member').populate('diet').lean();
            return h.view('report', {
                title: 'Recipes to Date',
                recipes: recipes,
            });
        }
    },
    addRecipe: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;
                const file = request.payload.imagefile;
                var image;
                if (Object.keys(file).length > 0) {
                    console.log("line 33");
                    image = await ImageStore.uploadImage(file);
                } else
                    image = String.Empty;

                const rawDiet = request.payload.diet.split(',');
                const diet = await Diet.findOne({
                    name: rawDiet[0],
                });


                const newRecipe = new Recipe({
                    name: data.name,
                    description: data.description,
                    member: user._id,
                    diet: diet._id,
                    image: image.url
                });
                await newRecipe.save();
                return h.redirect('/report');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        },
        payload: {
            multipart: true,
            output: 'data',
            maxBytes: 209715200,
            parse: true
        }
        }
};

module.exports = Recipes;