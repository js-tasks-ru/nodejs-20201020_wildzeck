const mongoose = require('mongoose');
const connection = require('../libs/connection');
const { schema } = require('./Product');

const subCategorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
});

const categorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },

    subcategories: [subCategorySchema],
});

[subCategorySchema, categorySchema].forEach((schema) =>
    schema.set('toJSON', { transform: getIdWithoutUnderscore })
);

function getIdWithoutUnderscore(doc, ret, options) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
}

module.exports = connection.model('Category', categorySchema);
