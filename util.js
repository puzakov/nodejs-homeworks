const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./storage.json");
exports.lowdb = low(adapter);

exports.webError = (err, ctx, code) => {
  console.error("err", err);
  ctx.status = 404;
};
