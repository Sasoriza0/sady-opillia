const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const {User} = require("../models/models.js");
const jwt = require('jsonwebtoken')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "url", // переконайся, що це точно правильний шлях!
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Логіка пошуку або створення користувача
    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
      user = new User({
        googleId: profile.id,
        name: profile.displayName,
        email: profile.emails[0].value,
      })
      await user.save()
    }

    return done(null, user);  // передача користувача після авторизації
  } catch (err) {
    return done(err, null);  // обробка помилки
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});