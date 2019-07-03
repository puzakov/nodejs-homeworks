const Koa = require("koa");
const static = require("koa-static");
const { router, db, get, errors, body } = require("./middleware");

const app = new Koa();
app
  .use(static("./public"))
  //   .use(flash())
  .use(errors)
  .use(db)
  .use(body)
  .use(get)
  .use(router.routes())
  .use(router.allowedMethods());

const port = 8080;
app.listen(port, () => {
  console.log(`Server http://localhost:${port}`);
});
