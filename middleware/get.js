const fs = require("fs");
const path = require("path");

module.exports = async (ctx, next) => {
  if (ctx.request.method === "GET" && ctx.request.url.indexOf('/api/') === -1) {
    const body = fs.readFileSync(
      process.cwd() + path.join("/public", "template.html")
    );
    ctx.type = "html";
    ctx.body = body;
    return;
  }

  await next();
};
