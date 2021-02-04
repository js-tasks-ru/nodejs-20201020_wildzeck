const User = require('../../models/User');

module.exports = async function authenticate(
    strategy,
    email,
    displayName,
    done
) {
    try {
        if (!email) {
            return done(null, false, 'Не указан email');
        }

        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            const newUser = await User.create({
                email: email,
                displayName: displayName,
            });
            return done(null, newUser);
        }

        return done(null, findUser);
    } catch (error) {
        done(error);
    }
};
