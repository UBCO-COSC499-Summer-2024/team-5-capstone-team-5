const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const { db } = require('./database');

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", [email]);
      if (!user) {
        return done(null, false, { message: 'Incorrect email.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

passport.serializeUser((user, done) => {
  process.nextTick(function() {
    return done(null, user.id);
  })
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $1", [id]);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
