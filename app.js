const Koa = require("koa");
const Pug = require("koa-pug");
const static = require("koa-static");
const session = require("koa-session");
const flash = require("koa-flash-simple");
const router = require("./router");
const koaBody = require("koa-body")({
  formidable: {
    uploadDir: "./public/assets/img/products/"
  },
  multipart: true
});

const app = new Koa();
const pug = new Pug({
  viewPath: "./views/pages",
  basedir: "./views",
  app: app
});

app
  .use(static("./public"))
  .use(
    session(
      {
        key: "common:session",
        maxAge: "session",
        overwrite: true,
        httpOnly: true,
        signed: false,
        rolling: false,
        renew: false
      },
      app
    )
  )
  .use(flash())
  .use(koaBody)
  .use(router.routes())
  .use(router.allowedMethods());

const port = 8080;
app.listen(port, () => {
  console.log(`Server http://localhost:${port}`);
});
