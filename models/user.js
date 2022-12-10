const mongoose = require("mongoose"),
  bcrypt = require("bcrypt-nodejs");

const SALT_FACTOR = 10;

const userSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  displayName: String,
  bio: String,
});

userSchema.methods.name = function () {
  return this.displayName || this.username;
};

const noop = function () {};

userSchema.pre("save", function (cb) {
  const user = this;
  if (!user.isModified("password")) return cb();
  bcrypt.genSalt(SALT_FACTOR, function (err, salt) {
    if (err) return cb(err);
    bcrypt.hash(user.password, salt, noop, function (err, hashedPassword) {
      if (err) return cb(err);
      user.password = hashedPassword;
      cb();
    });
  });
});

userSchema.methods.checkPassword = function (guess, cb) {
  bcrypt.compare(guess, this.password, function (err, isMatch) {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
