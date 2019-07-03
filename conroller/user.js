const { User } = require("../model");

exports.saveNewUser = async (ctx, next) => {
  const fields = JSON.parse(ctx.request.body);
  const user = new User(fields);

  try {
    const result = await user.save();
    ctx.body = {
      ...result,
      id: user._id,
      access_token: "my_cystom_token"
    };
  } catch (e) {
    console.error("User Saving error");
    throw e;
  }
};
