const express = require("express");
const router = express.Router();
const passport = require("passport");


const User = require("../models/user");

const catchAsync = require("../utils/catchAsync");


router.get("/register", (req, res) => {
    res.render("users/register");
})


router.post("/register", catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        await newUser.save()
        req.login(newUser, (err) => { if (err) { return next(err) } });
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/register")
    }
    req.flash("success", "signed up successfully");
    res.redirect("/campgrounds");


}));



router.get("/login", (req, res) => {
    res.render("users/login");
});


router.post("/login", passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash("success", `Welcome Back, ${req.body.username}`);
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})


router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds")
})

module.exports = router;