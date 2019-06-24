const { webError, lowdb } = require("../util");

exports.get = async (ctx, next) => {
  try {
    ctx.render("index", {
      social: lowdb.get("social").value(),
      skills: lowdb.get("skills").value(),
      products: lowdb.get("products").value(),
    });
  } catch (err) {
    webError(err, ctx, 400);
  }
};

exports.post = async (ctx, next) => {
  try {
    console.log(ctx.request.body);
    ctx.redirect('/');
  } catch (err) {
    webError(err, ctx, 400);
  }
};
