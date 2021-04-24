'use strict';

const cloudinary = require('cloudinary').v2;
const fs =require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

const ImageStore = {
    configure: function() {
        const credentials = {
            cloud_name: process.env.name,
            api_key: process.env.key,
            api_secret: process.env.secret
        };
        cloudinary.config(credentials);
    },

    getAllImages: async function() {
        const result = await cloudinary.v2.api.resources();
        return result.resources;
    },

    uploadImage: async function(imagefile) {
        await writeFile('./public/temp.img', imagefile);
        const response = await cloudinary.uploader.upload('./public/temp.img');
        return response;
    },

    displayImage: async function(id) {
        console.log("displaying image wiht id "+id);
        const result = await cloudinary.v2.api.resources_by_ids([id]);
        console.log("Result is" + result);
        return result.resources;
    },

    deleteImage: async function(id) {
        await cloudinary.v2.uploader.destroy(id, {});
    },

};

module.exports = ImageStore;