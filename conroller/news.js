const { News, User } = require("../model");

getAllNewsFormatted = async () => {
  const allNews = await News.find({}).populate("user");

  return allNews.map(item => {
    return { ...item.toObject(), id: item._id };
  });
};

exports.getNews = async (ctx, next) => {
  ctx.body = await getAllNewsFormatted();
};

exports.newNews = async (ctx, next) => {
  const newsItem = new News({ ...ctx.request.body });
  newsItem.user = await User.findById(ctx.request.body.userId);
  await newsItem.save();

  const allNews = await News.find({});

  ctx.body = await getAllNewsFormatted();
};

exports.updateNews = async (ctx, next) => {
  const { id } = ctx.params;
  await News.update({ _id: id }, { ...ctx.request.body });

  ctx.body = await getAllNewsFormatted();
};

exports.deleteNews = async (ctx, next) => {
  const { id } = ctx.params;
  await News.findByIdAndDelete(id);

  ctx.body = await getAllNewsFormatted();
};
