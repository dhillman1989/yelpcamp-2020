const express = require("express");
const app = express();
const morgan = require("morgan");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");

const catchAsync = require("./utils/catchAsync")

const Campground = require("./models/campground");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/yelp-camp", { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => { console.log("DB connected!") })
    .catch((err) => { console.log(err.message) });

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));
app.use(express.static('public'))




const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");


app.get("/error", (req, res) => {
    chicken();
})

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/campgrounds", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
}));

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new");
});


app.get("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/show", { campground });
}));

app.post("/campgrounds", catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`campgrounds/${campground._id}`);
}));


app.get("/campgrounds/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render("campgrounds/edit", { campground });
}));

app.put("/campgrounds/:id", catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });
    res.redirect(`/campgrounds/${req.params.id}`)
}));


app.delete("/campgrounds/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
}));



//404 page

app.use((req, res) => {
    res.send("404 - PAGE NOT FOUND")
})

////ERROR HANDLING
app.use((err, req, res, next) => {
    res.status(500).send("Internal Server Error! We're very sorry but something went wrong. If the problem continues, please try again in a little while.");
    next(err);
})

const PORT = 3000;
app.listen(PORT, () => console.log("Listening on port: 3000"));
