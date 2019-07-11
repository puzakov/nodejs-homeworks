const koaBody = require("koa-body");

module.exports = koaBody({
  formidable: {
    uploadDir: "./public/assets/img/"
  },
  multipart: true,
});
