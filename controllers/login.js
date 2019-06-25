const { lowdb } = require("../util");

exports.get = (request, response) => {
  const { msgslogin } = request.flash();
  response.render("login", {
    social: lowdb.get("social").value(),
    msgslogin
  });
};

exports.post = (request, response) => {
  const { email, password } = lowdb.get("auth").value();
  const credentials = { ...request.body };

  try {
    if (!credentials.email || !credentials.password) {
      throw "Email & pass are required";
    }

    if (email !== credentials.email || password !== credentials.password) {
      throw "Unathorized";
    }

    request.session.isAuth = true;
    response.redirect("/admin");
  } catch (err) {
    console.error("err", err);
    request.flash("msgslogin", err);
    response.redirect("/login");
  }
};
