const { mainCtrl, adminCtrl, loginCtrl } = require("../controllers");
const express = require("express");
const router = express.Router();

router.use((request, response, next) => {
  console.log(`Request ${request.method}: ${request.url}`);
  next();
});

router.get("/", mainCtrl.get);
router.post("/", mainCtrl.post);

router.get("/login", loginCtrl.get);
router.post("/login", loginCtrl.post);

router.get("/admin", adminCtrl.get);
router.post("/admin/skills", adminCtrl.postSkills);
router.post("/admin/upload", adminCtrl.postUpload);

module.exports = router;
