const koaBody = require("koa-body");

module.exports = koaBody({
  formidable: {
    uploadDir: "./public/assets/img/products/"
  },
  multipart: true,
});
