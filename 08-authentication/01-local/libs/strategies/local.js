const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    { usernameField: 'email', session: false },
    async function (email, password, done) {
        const findUser = await User.findOne({ email: email });

        if (!findUser) {
            done(null, false, 'Нет такого пользователя');
        }

        const isValidPassword = await findUser.checkPassword(password);

        if (!isValidPassword) {
            done(null, false, `Неверный пароль`);
        }

        done(null, findUser);
    }
);
