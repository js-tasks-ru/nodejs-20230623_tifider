const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');
const mapOrder = require('../mappers/order');

module.exports.checkout = async function checkout(ctx, next) {
    const {phone, product, address} = ctx.request.body;
    const user = ctx.user;

    const order = await Order.create({user, phone, product, address});

    await sendMail({template: 'order-confirmation', locals: {product}, to: user.email, subject: 'Заказ'});

    ctx.body = {order: order.id};
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
    const orders = await Order.find({user: ctx.user});

    ctx.body = {
        orders: orders.map(mapOrder)
    };
};
