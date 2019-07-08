const passport = require("koa-passport");
const LocalStrategy = require("passport-local").Strategy;
const passportJWT = require("passport-jwt");
const ExtractJWT = passportJWT.ExtractJwt;
const Strategy = passportJWT.Strategy;

const { User } = require("../model");
const { secret } = require("./config.json");

const params = {
  secretOrKey: secret,
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
};

passport.use(
  new LocalStrategy(
    {
      usernameField: "username"
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done("Invalid credentials");
        }
        if (!user.validPassword(password)) {
          return done("Invalid credentials");
        }
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  new Strategy(params, function(payload, done) {
    User.findById(payload._id)
      .then(user => {
        if (!user) {
          return done(new Error("User not found"));
        }
        return done(null, { id: user.id });
      })
      .catch(err => done(err));
  })
);
