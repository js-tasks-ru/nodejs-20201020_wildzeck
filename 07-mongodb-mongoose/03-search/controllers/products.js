const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {
    const { query } = ctx.request.query;
    const productsByQuery = await Product.find({ $text: { $search: query } });

    if (!productsByQuery.length) {
        ctx.response.status = 200;
        ctx.response.body = {
            products: [],
        };
    }

    ctx.response.status = 200;
    ctx.response.body = {
        products: productsByQuery,
    };
};
