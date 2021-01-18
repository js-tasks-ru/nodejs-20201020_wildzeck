const Category = require('../models/Category');

module.exports.categoryList = async function categoryList(ctx, next) {
    const categoryList = await Category.find({});

    ctx.response.status = 200;
    ctx.response.body = {
        categories: categoryList
    };
};
