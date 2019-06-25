const { lowdb } = require("../util");

exports.get = (request, response) => {
  response.render("index", {
    social: lowdb.get("social").value(),
    skills: lowdb.get("skills").value(),
    products: lowdb.get("products").value()
  });
};

exports.post = (request, response) => {
  console.log({ ...request.body });
  response.redirect("/");
};
