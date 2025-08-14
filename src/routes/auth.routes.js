const express = require("express");
const {
  getRegisterController,
  postRegisterController,
  getLoginController,
  postLoginController,
  userLogout,
} = require("../controllers/auth.controller");

const router = express.Router();

router.get("/register", getRegisterController);
router.post("/register", postRegisterController);
router.get("/login", getLoginController);
router.post("/login", postLoginController);
router.get("/logout", userLogout);

module.exports = router;
