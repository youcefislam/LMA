const passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy;

const User = require("./models/user");

module.exports = function () {
  passport.serializeUser((user, cb) => cb(null, user._id));
  passport.deserializeUser((id, cb) => {
    User.findById(id, (err, user) => {
      cb(err, user);
    });
  });
  passport.use(
    new LocalStrategy(function (username, password, cb) {
      User.findOne({ username }, function (err, user) {
        if (err) {
          return cb(err);
        }
        if (!user) {
          return cb(null, false, { message: "No user has that username." });
        }
        user.checkPassword(password, (err, isMatch) => {
          if (err) return cb(err);
          if (!isMatch)
            return cb(null, false, { message: "Invalid password." });
          return cb(null, user);
        });
      });
    })
  );
};
