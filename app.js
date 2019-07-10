const Koa = require("koa");
const static = require("koa-static");
const { router, db, get, errors, body, io } = require("./middleware");

const app = new Koa();
require("./config/passport");

app
.use(static("./public"))
.use(errors)
.use(body)
.use(db)
.use(get)
.use(router.routes())
.use(router.allowedMethods());

io.attach(app);

const port = 8080;
app.listen(process.env.PORT || port, () => {
  console.log(`Server http://localhost:${port}`);
});
