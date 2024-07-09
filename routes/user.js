const express = require("express");
const router = express.Router();
let User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userContoller = require("../controllers/users.js");

router
  .route("/signup")
  .get(userContoller.renderSignUpForm)
  .post(wrapAsync(userContoller.signup));

router
  .route("/login")
  .get(userContoller.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userContoller.login
  );

router.get("/logout", userContoller.logout);

module.exports = router;
