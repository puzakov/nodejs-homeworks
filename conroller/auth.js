const jwt = require("jsonwebtoken");
const passport = require("koa-passport");
const secret = require("../config/config.json").secret;
const { User } = require("../model");

exports.login = async (ctx, next) => {
  console.log(ctx.request.body);
  return passport.authenticate(
    "local",
    { session: false },
    async (error, user, info) => {
      if (error) {
        ctx.body = {
          error
        };
        return;
      }

      if (user) {
        const token = jwt.sign({ ...user.toObject() }, secret);
        ctx.body = {
          ...user.toObject(),
          id: user._id,
          access_token: token
        };
      } else {
        ctx.body = {
          error: "Invalid user"
        };
      }
    }
  )(ctx, next);
};

exports.authFromToken = async (ctx, next) => {
  let error = { status: 403, message: "Invalid token" };
  const { access_token } = ctx.request.body;

  if (!jwt.verify(access_token, secret)) throw error;

  const tokenUser = jwt.decode(access_token);
  const user = await User.findById(tokenUser._id).populate("permission");
  if (!user) throw error;

  const token = jwt.sign({ ...user.toObject() }, secret);
  ctx.body = {
    ...user.toObject(),
    id: user._id,
    access_token: token
  };
};
