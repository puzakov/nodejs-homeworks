const Router = require("koa-router");
const { authCtrl, userCtrl, newsCtrl } = require("../conroller");

const router = new Router();

router.prefix("/api");

router.post("/saveNewUser", userCtrl.saveNewUser)

module.exports = router;
