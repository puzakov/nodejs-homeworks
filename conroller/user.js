const { User } = require("../model");

exports.saveNewUser = async (ctx, next) => {
  const fields = { ...ctx.request.body };
  try {
    const exist = await User.findOne({ username: fields.username });
    if (exist) throw { status: 400, message: "Can not create new user" };

    const user = new User(fields);
    user.setPassword(fields.password);
    const result = await user.save();
    ctx.body = {
      ...user.toObject(),
      id: user._id,
      access_token: "my_cystom_token"
    };
  } catch (e) {
    console.error("User Saving error");
    throw e;
  }
};
