const {v4: uuid} = require('uuid');
const User = require('../models/User');
const Session = require('../models/Session');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
    const verificationToken = uuid();
    const {email, displayName, password} = ctx.request.body;

    const user = await User.create({email, displayName, verificationToken});

    await user.setPassword(password);
    await user.save();

    await sendMail({template: 'confirmation', to: email, subject: 'Registration'});

    ctx.body = {status: 'ok'};
};

module.exports.confirm = async (ctx, next) => {
    const {verificationToken} = ctx.request.body;
    const user = await User.findOne({verificationToken});

    if (!user) {
        ctx.throw(400, 'Ссылка подтверждения недействительна или устарела');
    }

    user.verificationToken = undefined;
    user.save();

    const token = uuid();
    ctx.body = await Session.create({token, lastVisit: Date.now(), user});
};
