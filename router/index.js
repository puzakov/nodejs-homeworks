const { mainCtrl, adminCtrl, loginCtrl } = require("../controllers");
const Router = require("koa-router");
const router = new Router();

router.all(/.*/, (ctx, next) => { 
  console.log(`Request ${ctx.request.method}: ${ctx.request.url} ${ctx.status}`);
  next();
})

router.get("/", mainCtrl.get);
router.post("/", mainCtrl.post);

router.get("/login", loginCtrl.get);
router.post("/login", loginCtrl.post);

router.get("/admin", adminCtrl.get);
router.post("/admin/skills", adminCtrl.postSkills);
router.post("/admin/upload", adminCtrl.postUpload);

module.exports = router;
