const session = require("express-session");
const flash = require("express-flash");
const fileupload = require("express-fileupload");

exports.router = require("./router");

exports.session = session({
  secret: "common:session",
  key: "sessionkey",
  cookie: {
    path: "/",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // a day lifetime
  },
  saveUninitialized: false,
  resave: false
});

exports.flash = flash();

exports.fileupload = fileupload();
