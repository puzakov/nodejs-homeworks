const Router = require("koa-router");
const passport = require("koa-passport");
const { authCtrl, userCtrl, newsCtrl } = require("../conroller");
const auth = passport.authenticate("jwt", { session: false });

const router = new Router();

router.prefix("/api");

const jsonBody = async (ctx, next) => {
  ctx.request.body = JSON.parse(ctx.request.body);
  await next();
};

router.post("/saveNewUser", jsonBody, userCtrl.saveNewUser);
router.post("/login", jsonBody, authCtrl.login);
router.post("/authFromToken", jsonBody, authCtrl.authFromToken);

router.get("/getNews", auth, newsCtrl.getNews);
router.post("/newNews", auth, jsonBody, newsCtrl.newNews);
router.put("/updateNews/:id", auth, jsonBody, newsCtrl.updateNews);
router.delete("/deleteNews/:id", auth, newsCtrl.deleteNews);

module.exports = router;
