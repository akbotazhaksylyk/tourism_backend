const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust the path if your User model is located elsewhere

module.exports = function (passport) {
    passport.use(new LocalStrategy(
        { usernameField: 'username' }, // Change 'email' to 'username' if that's what you're using
        async (username, password, done) => {
            try {
                // Match user
                const user = await User.findOne({ username: username });
                if (!user) {
                    return done(null, false, { message: 'That username is not registered' });
                }

                // Match password
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Password incorrect' });
                }
            } catch (err) {
                return done(err);
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user.id); // user.id is used to serialize the user
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });    
};