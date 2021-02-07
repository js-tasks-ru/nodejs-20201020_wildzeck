const { v4: uuid } = require('uuid');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const { email, displayName, password } = ctx.request.body;
    const token = uuid();

    const newUser = await User.create({
        email: email,
        displayName: displayName,
        password: password,
        verificationToken: token,
    });

    await newUser.setPassword(password);
    await newUser.save();

    const emailResponse = await sendMail({
        to: email,
        subject: 'registration verification',
        locals: { url: `http://localhost:3000/confirm/${token}` },
        template: 'confirmation',
    });

    ctx.response.body = {
        status: 'ok',
    };
};

module.exports.confirm = async (ctx, next) => {
    const { verificationToken } = ctx.request.body;
    const user = await User.findOne({ verificationToken: verificationToken });

    if (!user) {
        ctx.response.code = 400;
        return (ctx.response.body = {
            error: 'Ссылка подтверждения недействительна или устарела',
        });
    }

    user.verificationToken = undefined;
    await user.save();

    const token = uuid();
    ctx.response.body = {
        token: token,
    };
};
