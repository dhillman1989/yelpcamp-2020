const express = require("express");
const app = express();

const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const passportLocal = require("passport-local");
const User = require("./models/user")



///ROUTES
const userRoutes = require("./routes/users")
const campgroundRoutes = require("./routes/campgrounds")
const reviewRoutes = require("./routes/reviews");

const ExpressError = require("./utils/ExpressError")

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp", {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true, useCreateIndex: true
})
    .then(() => { console.log("DB connected!") })
    .catch((err) => { console.log(err.message) });


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static('public'));


const path = require("path");
const { ValidationError } = require("joi");

//VIEW EJS SETTINGS
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");


//SESSION SETUP
const sessionConfig = {
    secret: "temporarySecret", resave: false,
    saveUninitialized: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,

    }
}
app.use(session(sessionConfig));

////PASSPORT 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

///middleware for flash messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.returnTo = req.session.returnTo;
    next();
});




app.use("/", userRoutes)
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);


app.get("/", (req, res) => {
    res.render("home");
});












//404 page

app.all("*", (req, res, next) => {
    next(new ExpressError("PAGE NOT FOUND", 404))
});


////ERROR HANDLING
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = "OH DEAR! That wasn't supposed to happen!";
        res.status(statusCode).redirect("error", { err });
        next(err);
    }
    next();
})

const PORT = 3000;
app.listen(PORT, () => console.log("Listening on port: 3000"));
