const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");

const User = require("./db/models/user");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
          return done(null, false, { message: "could not find user" });
        }

        const bcryptMatch = await bcrypt.compare(password, user.password);
        if (!bcryptMatch) {
          return done(null, false, { message: "password does not match" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user.id);
});

passport.deserializeUser(async (id, cb) => {
  try {
    console.log("getting most current user from MongoDB Store");
    const user = await User.findById(id);
    if (!user) {
      return cb(null, false);
    }
    cb(null, user);
  } catch (err) {
    cb(err);
  }
});

module.exports = passport;
