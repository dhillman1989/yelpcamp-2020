const express = require("express");
const router = express.Router();
const passport = require("passport");


const User = require("../models/user");

const catchAsync = require("../utils/catchAsync");


router.get("/register", (req, res) => {
    res.render("users/register");
})


router.post("/register", catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const newUser = await User.register(user, password);
        await newUser.save()
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
    res.redirect("/campgrounds")
})

module.exports = router;