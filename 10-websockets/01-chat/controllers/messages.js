const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
    const messages = await Message.find()
        .sort({ date: 1 })
        .limit(20)
        .populate('user');

    ctx.response.body = {
        messages: messages.map((message) => ({
            date: message.date,
            text: message.text,
            id: message.id,
            user: message.user.displayName,
        })),
    };
};

