import passport = require('passport');
import passportLocal = require('passport-local')
const LocalStrategy = passportLocal.Strategy;

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function (email, password, cb) {
        // TODO DB call
    //     return UserModel.findOne({email, password})
    //     .then(user => {
    //         if (!user) {
    //             return cb(null, false, {message: 'Incorrect email or password.'});
    //         }               return cb(null, user, {message: 'Logged In Successfully'});
    //    })
    //    .catch(err => cb(err));
    }
));