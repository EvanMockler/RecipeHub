'use strict';

const User = require('../models/user');
const Recipe = require('../models/recipe');
const ImageStore = require('../utils/image-store');
const Diet = require('../models/diet')
const Ingredient = require('../models/ingredient')
const Joi = require('@hapi/joi');


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
                recipes: recipes
            });
        }
    },
    viewRecipe:{
        handler: async function(request, h) {
            try {
                const recipe = await Recipe.findOne({ _id: request.params.id }).populate('member').populate('ingredients').lean();
                return h.view('viewrecipe', {
                    title: recipe.name,
                    recipe: recipe,
                });

            }
            catch (e) {
                console.log("error is" + e);
            }
        },
    },
    addRecipe: {
        validate: {
            payload: {
                name: Joi.string().required(),
                description: Joi.string().required(),
                amount1: Joi.optional(),
                unit1: Joi.string().optional(),
                ingredient1: Joi.optional(),
                amount2: Joi.optional(),
                unit2: Joi.string().optional(),
                ingredient2: Joi.optional(),
                amount3: Joi.optional(),
                unit3: Joi.string().optional(),
                ingredient3: Joi.optional(),
                amount4: Joi.optional(),
                unit4: Joi.string().optional(),
                ingredient4: Joi.optional(),
                amount5: Joi.optional(),
                unit5: Joi.string().optional(),
                ingredient5: Joi.optional(),
                amount6: Joi.optional(),
                unit6: Joi.string().optional(),
                ingredient6: Joi.optional(),
                amount7: Joi.optional(),
                unit7: Joi.string().optional(),
                ingredient7: Joi.optional(),
                amount8: Joi.optional(),
                unit8: Joi.string().optional(),
                ingredient8: Joi.optional(),
                amount9: Joi.optional(),
                unit9: Joi.string().optional(),
                ingredient9: Joi.optional(),
                amount10: Joi.optional(),
                unit10: Joi.string().optional(),
                ingredient10: Joi.optional(),
                diet: Joi.optional(),
                imagefile: Joi.optional()
            },
            options: {
                abortEarly: false,
            },
            failAction: function(request, h, error) {
                return h
                  .view('home', {
                      title: 'Home error',
                      errors: error.details
                  })
                  .takeover()
                  .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                const data = request.payload;
                const file = request.payload.imagefile;
                var image;
                if (Object.keys(file).length > 0) {
                    const temp = await ImageStore.uploadImage(file);
                    image = temp.url;
                } else
                    image = String.Empty;

                const rawDiet = request.payload.diet;
                var diet;
                if(rawDiet==undefined){
                    diet = await Diet.findOne({
                        name: "Non Diet",
                    });

                }else{
                    diet = await Diet.findOne({
                        name: rawDiet,
                    });
                }


                const newRecipe = new Recipe({
                    name: data.name,
                    description: data.description,
                    member: user._id,
                    diet: diet._id,
                    image: image
                });
                if(request.payload.amount1.length>0 || request.payload.ingredient1.length>0) {
                    let ingredient = new Ingredient({
                        amount: request.payload.amount1,
                        unit: request.payload.unit1,
                        name: request.payload.ingredient1
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
                if(request.payload.amount2.length>0 || request.payload.ingredient2.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount2,
                        unit: request.payload.unit2,
                        name: request.payload.ingredient2
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
                if(request.payload.amount3.length>0 || request.payload.ingredient3.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount3,
                        unit: request.payload.unit3,
                        name: request.payload.ingredient3
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
                if(request.payload.amount4.length>0 || request.payload.ingredient4.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount4,
                        unit: request.payload.unit4,
                        name: request.payload.ingredient4
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
                if(request.payload.amount5.length>0 || request.payload.ingredient5.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount5,
                        unit: request.payload.unit5,
                        name: request.payload.ingredient5
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
                if(request.payload.amount6.length>0 || request.payload.ingredient6.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount6,
                        unit: request.payload.unit6,
                        name: request.payload.ingredient6
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
                if(request.payload.amount7.length>0 || request.payload.ingredient7.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount7,
                        unit: request.payload.unit7,
                        name: request.payload.ingredient7
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }

                if(request.payload.amount8.length>0 || request.payload.ingredient8.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount8,
                        unit: request.payload.unit8,
                        name: request.payload.ingredient8
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
                if(request.payload.amount9.length>0 || request.payload.ingredient9.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount9,
                        unit: request.payload.unit9,
                        name: request.payload.ingredient9
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
                if(request.payload.amount10.length>0 || request.payload.ingredient10.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount10,
                        unit: request.payload.unit10,
                        name: request.payload.ingredient10
                    })
                    ingredient.save();
                    newRecipe.ingredients.push(ingredient);
                }
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
    },

    editRecipe: {
        handler: async function(request, h) {
            try {
                const id = request.params.id;
                const diets = await Diet.find().lean();
                const recipe = await Recipe.findById(id).populate("diet").populate('ingredients').lean();
                return h.view('editrecipe', { title: 'Recipe Information', recipe: recipe, diets: diets });
            } catch (err) {
                return h.view('report', { errors: [{ message: err.message }] });
            }
        }
    },
    updateRecipe: {
        handler: async function(request, h) {
            try {
                const recipeUpdate = request.payload;
                const id = request.params.id;
                const recipe = await Recipe.findById(id);
                recipe.name = recipeUpdate.name;
                recipe.description = recipeUpdate.description;
                for(let i=0;i<recipe.ingredients.length;i++){
                 let ingredientId = recipe.ingredients[i];
                 const ingredient = await Ingredient.findById(ingredientId);
                 ingredient.amount = recipeUpdate.amount[i];
                 ingredient.unit = recipeUpdate.unit[i];
                 ingredient.name = recipeUpdate.ingredient[i];
                 await ingredient.save();
                }
                if(request.payload.amount1.length>0 || request.payload.ingredient1.length>0) {
                    let ingredient = new Ingredient({
                        amount: request.payload.amount1,
                        unit: request.payload.unit1,
                        name: request.payload.ingredient1
                    })
                    ingredient.save();
                    recipe.ingredients.push(ingredient);
                }
                if(request.payload.amount2.length>0 || request.payload.ingredient2.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount2,
                        unit: request.payload.unit2,
                        name: request.payload.ingredient2
                    })
                    ingredient.save();
                    recipe.ingredients.push(ingredient);
                }
                if(request.payload.amount3.length>0 || request.payload.ingredient3.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount3,
                        unit: request.payload.unit3,
                        name: request.payload.ingredient3
                    })
                    ingredient.save();
                    recipe.ingredients.push(ingredient);
                }
                if(request.payload.amount4.length>0 || request.payload.ingredient4.length>0){
                    let ingredient = new Ingredient({
                        amount: request.payload.amount4,
                        unit: request.payload.unit4,
                        name: request.payload.ingredient4
                    })
                    ingredient.save();
                    recipe.ingredients.push(ingredient);
                }
                const rawDiet = request.payload.diet;
                const diet = await Diet.findOne({
                    name: rawDiet
                });
                recipe.diet = diet._id;
                await recipe.save();
                return h.redirect('/recipe/' + recipe._id);
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        },
    },
    deleteRecipe: {
        handler: async function(request, h) {
            try {
                const recipe = await Recipe.findOne({ _id: request.params.id });
                for(let i = 0 ; i < recipe.ingredients.length; i++ ){
                    await Ingredient.findOneAndDelete({_id: recipe.ingredients[i]});
                }
                await Recipe.findOneAndDelete({ _id: request.params.id });
                return h.redirect('/report');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        },
    }
};

module.exports = Recipes;