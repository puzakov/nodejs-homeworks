const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { User, Permission } = require("../model");
const secret = require("../config/config.json").secret;

getAllUsersFormatted = async () => {
  const allUsers = await User.find({}).populate("permission");

  return allUsers.map(item => {
    return {
      ...item.toObject(),
      id: item._id,
      permissionId: item.permission._id
    };
  });
};

exports.saveNewUser = async (ctx, next) => {
  const fields = { ...ctx.request.body };
  try {
    const exist = await User.findOne({ username: fields.username });
    if (exist) throw { status: 400, message: "Can not create new user" };
    const permission = await new Permission(fields.permission).save();
    const user = new User({ ...fields, permission });
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

exports.getUsers = async (ctx, next) => {
  ctx.body = await getAllUsersFormatted();
};

exports.updateUserPermission = async (ctx, next) => {
  const { id } = ctx.params;
  const { chat, news, setting } = ctx.request.body.permission;

  const item = await Permission.findById(id);
  const { chat: oldChat, news: oldNews, setting: oldSetting } = item;

  if (chat) item.chat = { ...oldChat, ...chat };
  if (news) item.news = { ...oldNews, ...news };
  if (setting) item.setting = { ...oldSetting, ...setting };

  await item.save();
  ctx.body = { id };
};

exports.deleteUser = async (ctx, next) => {
  const { id } = ctx.params;
  const user = await User.findById(id).populate("permission");
  await user.permission.remove();
  await user.remove();

  ctx.body = await getAllUsersFormatted();
};

exports.updateUser = async (ctx, next) => {
  const { id } = ctx.params;
  const user = await User.findById(id).populate("permission");
  const { oldPassword, password, ...names } = ctx.request.body;

  if (names) user.set(names);

  if (oldPassword && password) {
    if (!user.validPassword(oldPassword))
      throw { status: 400, message: "Bad request" };

    user.setPassword(password);
  }

  await user.save();
  const token = jwt.sign({ ...user.toObject() }, secret);

  ctx.body = {
    ...user.toObject(),
    id: user._id,
    access_token: token
  };
};

exports.saveUserImage = async (ctx, next) => {
  const { id } = ctx.params;

  const { name: photoName, size, path: tempPath } = ctx.request.files[id];
  const uploadDir = path.join(process.cwd(), "/public", "assets", "img", id);
  const newPath = path.join(uploadDir, photoName);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  fs.renameSync(tempPath, newPath);

  const user = await User.findById(id);
  if (
    user.image &&
    fs.existsSync(path.join(process.cwd(), "/public", user.image))
  )
    fs.unlinkSync(path.join(process.cwd(), "/public", user.image));

  await user.set({ image: `/assets/img/${id}/${photoName}` }).save();

  ctx.body = { path: user.image };
};
