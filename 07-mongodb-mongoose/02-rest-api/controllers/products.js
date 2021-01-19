const Product = require('../models/Product');
const mongoose = require('mongoose');
const Category = require('../models/Category');

module.exports.productsBySubcategory = async function productsBySubcategory(
    ctx,
    next
) {
    const { subcategory } = ctx.request.query;
    if (!subcategory) {
        return next();
    }

    const productsBySubcategory = await Product.find({
        subcategory: mongoose.Types.ObjectId(subcategory),
    });

    if (productsBySubcategory.length) {
        ctx.response.status = 200;
        ctx.response.body = {
            products: productsBySubcategory,
        };
    } else {
        ctx.response.status = 200;
        ctx.response.body = {
            products: [],
        };
    }
};

module.exports.productList = async function productList(ctx, next) {
    const productList = await Product.find({});

    ctx.response.status = 200;
    ctx.response.body = {
        products: productList,
    };
};

module.exports.productById = async function productById(ctx, next) {
    const { id } = ctx.params;

    if (!mongoose.isValidObjectId(id)) {
        ctx.response.status = 400;
        return (ctx.response.body = {
            product: [],
        });
    }

    const product = await Product.findById(id);
    if (product) {
        ctx.response.status = 200;
        ctx.response.body = {
            product: product,
        };
    } else {
        ctx.response.status = 404;
        ctx.response.body = {
            product: [],
        };
    }
};
