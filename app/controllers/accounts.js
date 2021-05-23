'use strict';

const User = require('../models/user');
const Boom = require('@hapi/boom');
const Joi = require('@hapi/joi');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const Accounts = {
    index: {
        auth: false,
        handler: function(request, h) {
            return h.view('main', { title: 'Welcome to RecipeHub' });
        }
    },
    showSignup: {
        auth: false,
        handler: function(request, h) {
            return h.view('signup', { title: 'Sign up for RecipeHub' });
        }
    },
    signup: {
        auth: false,
        validate: {
            payload: {
                firstName: Joi.string().regex(/^[A-Z][a-z-']{0,12}$/).message("Max 13 characters for First Name field (Letters, numbers, apostrophes & hyphens valid)"), // Names up to 13 characters allowed, hyphen and apostrophe
                lastName: Joi.string().regex(/^[A-Z][a-z-']{0,16}$/).message("Max 17 characters for Last Name field(Letters, numbers, apostrophes,Hyphens valid"), // Names up to 17 characters allowed, hyphen and apostrophe
                email: Joi.string().regex(/^\S+@\S+.+[A-Za-z]$/).message("Valid email must contain @ character")
                    .email()
                    .required(),
                password: Joi.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/).message("Password must be over 8 characters. It must contain at least 1 Uppercase, 1 Lowercase and a number"), //password must be over 8 characters and an uppercase & lowercase letter, a number
            },
            options: {
                abortEarly: false,
            },
            failAction: function(request, h, error) {
                return h
                    .view('signup', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const payload = request.payload;
                let user = await User.findByEmail(payload.email);
                if (user) {
                    const message = 'Email address is already registered';
                    throw Boom.badData(message);
                }

                const hash = await bcrypt.hash(payload.password, saltRounds);

                const newUser = new User({
                    firstName: payload.firstName,
                    lastName: payload.lastName,
                    email: payload.email,
                    password: hash
                });
                user = await newUser.save();
                request.cookieAuth.set({ id: user.id });
                return h.redirect('/home');
            } catch (err) {
                return h.view('signup', { errors: [{ message: err.message }] });
            }
        }
    },
    showLogin: {
        auth: false,
        handler: function(request, h) {
            return h.view('login', { title: 'Login to RecipeHub' });
        }
    },
    login: {
        auth: false,
        validate: {
            payload: {
                email: Joi.string()
                    .email()
                    .required(),
                password: Joi.string().required()
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('login', {
                        title: 'Sign in error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            const { email, password } = request.payload;
            try {
                let user = await User.findByEmail(email);
                if (!user) {
                    const message = 'Email address is not registered';
                    throw Boom.unauthorized(message);
                }
                if (!await user.comparePassword(password)) {
                    const message = 'Password mismatch';
                    throw Boom.unauthorized(message);
                } else {
                    request.cookieAuth.set({ id: user.id });
                    return h.redirect('/home');
                }
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },
    logout: {
        auth: false,
        handler: function(request, h) {
            request.cookieAuth.clear();
            return h.redirect('/');
        }
    },


    showSettings: {
        handler: async function(request, h) {
            try {
                const id = request.auth.credentials.id;
                const user = await User.findById(id).lean();
                return h.view('settings', { title: 'RecipeHub Settings', user: user });
            } catch (err) {
                return h.view('login', { errors: [{ message: err.message }] });
            }
        }
    },


    updateSettings: {
        validate: {
            payload: {
                firstName: Joi.string().required().regex(/^[A-Z][a-z-']{0,12}$/).message("Max 13 characters for First Name field (Letters, numbers, apostrophes & hyphens valid)"),
                lastName: Joi.string().required().regex(/^[A-Z][a-z-']{0,16}$/).message("Max 17 characters for Last Name field(Letters, numbers, apostrophes,Hyphens valid"),
                email: Joi.string()
                    .email()
                    .required().regex(/^\S+@\S+.+[A-Za-z]$/).message("Valid email must contain @ character"),
                password: Joi.string().regex(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,32}$/).message("Password must be over 8 characters. It must contain at least 1 Uppercase, 1 Lowercase and a number")
            },
            options: {
                abortEarly: false
            },
            failAction: function(request, h, error) {
                return h
                    .view('settings', {
                        title: 'Sign up error',
                        errors: error.details
                    })
                    .takeover()
                    .code(400);
            }
        },
        handler: async function(request, h) {
            try {
                const userEdit = request.payload;
                const id = request.auth.credentials.id;
                const user = await User.findById(id);
                user.firstName = userEdit.firstName;
                user.lastName = userEdit.lastName;
                user.email = userEdit.email;
                user.password = userEdit.password;
                await user.save();
                return h.redirect('/settings');
            } catch (err) {
                return h.view('main', { errors: [{ message: err.message }] });
            }
        }
    },
};

module.exports = Accounts;