const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

mongoose
  .connect(
    "mongodb+srv://user:user@cluster0-lqsp2.mongodb.net/loftschool_exam?retryWrites=true&w=majority",
    { useNewUrlParser: true }
  )
  .catch(e => {
    console.error("Mongo connection error");
  });

module.exports = async (ctx, next) => {
  // подключение
  const db = mongoose.connection;

  db.on("connected", () => {
    console.log("MongoDB connected");
  });
  db.on("error", e => {
    console.log(e);
  });
  db.on("disconnected", () => {
    console.log("MongoDB disconnected");
  });

  ctx.db = db;
  await next();
};
