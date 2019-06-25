const express = require("express");
const bodyParser = require("body-parser");
const { session, flash, router, fileupload } = require("./middlewares");
const app = express();

app
  .set("views", "./views/pages")
  .set("view engine", "pug")
  .use(express.static("./public"))
  .use(bodyParser.urlencoded({ extended: false }))
  .use(bodyParser.json())
  .use(session)
  .use(flash)
  .use(fileupload)
  .use(router);

const port = 8080;
app.listen(port, () => {
  console.log(`Server http://localhost:${port}`);
});
