const { webError, lowdb } = require("../util");

exports.get = async (ctx, next) => {
  console.log("ctx.flash", ctx.flash);
  try {
    const msgslogin =
    ctx.flash && ctx.flash.get() ? ctx.flash.get().msgslogin : null;
    
    console.log("msgslogin", msgslogin);
    ctx.render("login", {
      social: lowdb.get("social").value(),
      msgslogin
    });
  } catch (err) {
    webError(err, ctx, 400);
  }
};

exports.post = async (ctx, next) => {
  const { email, password } = lowdb.get("auth").value();
  const credentials = ctx.request.body;

  try {
    if (!credentials.email || !credentials.password) {
      throw 'Email & pass are required';
    }

    if (email !== credentials.email || password !== credentials.password) {
      throw 'Unathorized';
    }

    ctx.session.isAuth = true;
    ctx.redirect('admin');
  } catch (err) {
    console.error("err", err);
    ctx.flash.set({ msgslogin: err });
    ctx.redirect("/login");
  }
};
