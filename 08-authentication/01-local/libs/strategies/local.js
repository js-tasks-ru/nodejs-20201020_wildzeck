const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');

module.exports = new LocalStrategy(
    { usernameField: 'email', session: false },
    async function (email, password, done) {
        try {
            const findUser = await User.findOne({ email: email });
            if (!findUser) {
                return done(null, false, 'Нет такого пользователя');
            }

            const isValidPassword = await findUser.checkPassword(password);
            if (!isValidPassword) {
                return done(null, false, `Неверный пароль`);
            }

            done(null, findUser);
        } catch (error) {
            done(error);
        }
    }
);
