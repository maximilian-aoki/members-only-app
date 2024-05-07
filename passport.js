const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      // fill this in after db schema creation
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser((id, cb) => {
  try {
    // fill this in after db schema creation
  } catch (err) {
    cb(err);
  }
});

module.exports = passport;
