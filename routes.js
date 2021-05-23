'use strict';

const Accounts = require('./app/controllers/accounts');
const Recipes = require('./app/controllers/recipes');

module.exports = [
    { method: 'GET', path: '/', config: Accounts.index },
    { method: 'GET', path: '/signup', config: Accounts.showSignup },
    { method: 'GET', path: '/login', config: Accounts.showLogin },
    { method: 'GET', path: '/logout', config: Accounts.logout },
    { method: 'POST', path: '/signup', config: Accounts.signup },
    { method: 'POST', path: '/login', config: Accounts.login },
    { method: 'GET', path: '/settings', config: Accounts.showSettings },
    { method: 'POST', path: '/settings', config: Accounts.updateSettings },

    { method: 'GET', path: '/home', config: Recipes.home },
    { method: 'GET', path: '/report', config: Recipes.report },
    { method: 'POST', path: '/addRecipe', config: Recipes.addRecipe },
    { method: 'GET', path: '/recipe/{id}', config: Recipes.viewRecipe },
    { method: 'GET', path: '/editrecipe/{id}', config: Recipes.editRecipe },
    { method: 'POST', path: '/updateRecipe/{id}', config: Recipes.updateRecipe },
    { method: 'GET', path: '/deleterecipe/{id}', config: Recipes.deleteRecipe },

    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: './public'
            }
        },
        options: { auth: false }
    }
];