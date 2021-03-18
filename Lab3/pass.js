const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const CookieStrategy = require('passport-cookie').Strategy
const User = require('./user').User
const uploadUserToDatabase = require('./db').uploadUserToDatabase;

const loginStrategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {

        User.findOne({username: username}, function (err, user) {
            if (err) throw(err);
            if (!user) {
                return done(null, false, {message: "Неверное имя пользователя"});
            }

            user.validatePassword(password).then((result) => {
                console.log(typeof result);
                if (result) {
                    return done(null, user);
                }

                return done(null, false, {message: 'Неверный пароль'});
            });


        });
    }
);

const registerStrategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {

        User.findOne({username: username}, function (err, user) {
            if (err) throw(err);
            if (user) {
                return done(null, false, {message: "Пользователь уже существует"});
            }

            uploadUserToDatabase(username, password).then((newUser) => {
                if (newUser) {
                    return done(null, newUser);
                }

                return done(null, false, {message: "Пользователь не добавлен. Пожалуйста, попробуйте повторить снова "});

            });


        });
    }
);

const cookieStrategy = new CookieStrategy({
    cookieName: 'session',
    passReqToCallback: true
}, function (req, session, done) {
    if (!req.user) return done(null, false, {message: "Вы должны авторизоваться"});
    User.findOne({username: req.user.username}, function (err, user) {
        if (err) throw (err);
        if (user) {
            return done(null, user);
        }
        return done(null, false, {message: "Вы должны авторизоваться"});
    });

});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use('login', loginStrategy);
passport.use('register', registerStrategy);
passport.use('cookie', cookieStrategy);


exports.passport = passport;
