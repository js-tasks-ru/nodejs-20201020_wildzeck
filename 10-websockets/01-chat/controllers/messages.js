const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
    const messages = await Message.find({chat: ctx.user.id})
        .sort({ date: 1 })
        .limit(20);


    ctx.response.body = {
        messages: messages.map((message) => ({
            date: message.date,
            text: message.text,
            id: message.id,
            user: message.user
        })),
    };
};
