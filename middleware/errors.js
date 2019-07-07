module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (e) {
    if (e.status) {
      ctx.body = { error: e.message };
      ctx.status = e.status;
    } else {
      ctx.body = { error: "Error 500"};
      ctx.status = 500;
      console.error("CATCHED Unknown.", e.message, e.stack);
    }
    return;
  }
};
