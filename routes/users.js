const express = require("express");
const router = express.Router();
const passport = require("passport");

const User = require("../models/user");

const users = require("../controllers/users");

const catchAsync = require("../utils/catchAsync");

router
  .route("/register")
  .get(users.renderRegisterForm)
  .post(catchAsync(users.createUser));

router
  .route("/login")
  .get(users.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    (req, res) => {
      req.flash("success", `Welcome Back, ${req.body.username}`);
      const redirectUrl = req.session.returnTo || "/campgrounds";
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    }
  );

router.get("/logout", users.logout);

module.exports = router;
