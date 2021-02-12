const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
    const { id, email } = ctx.user;
    const { product, phone, address } = ctx.request.body;
    const newOrder = await Order.create({
        user: id,
        product: product,
        phone: phone,
        address: address,
    });

    await sendMail({
        to: email,
        subject: 'order verification',
        locals: { order: newOrder.id, product: product },
        template: 'order-confirmation',
    });

    ctx.response.body = {
        order: newOrder.id,
    };
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const { id } = ctx.user;
    const userOrders = await Order.find({ user: id });

    ctx.response.body = {
        orders: userOrders,
    };
};
