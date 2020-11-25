const express = require("express");
const router = express.Router();


//VALIDATION SCHEMAS
const { campgroundSchema } = require("../schemas.js");


//error checking
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//models
const Campground = require("../models/campground");


//middlewares
const { isLoggedIn } = require("../middleware");




//VALIDATION OF CAMPGROUND CREATE AND EDIT FORMS
const validateCampground = (req, res, next) => {
    const validationResult = campgroundSchema.validate(req.body);
    if (validationResult.error) {
        next(validationResult.error)
    }
    next();
};


router.get("/", catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
}));

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});


router.get("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if (!campground) {
        req.flash("error", "Campground doesn't exist! it may have been removed.");
        return res.redirect("/campgrounds");
    }
    const { reviews } = campground;
    res.render("campgrounds/show", { campground, reviews });
}));

router.post("/", validateCampground, catchAsync(async (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError("Invalid Data Submitted!", 400)
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'successfully created campground');
    res.redirect(`campgrounds/${campground._id}`);
}));


router.get("/:id/edit", catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "Campground doesn't exist! it may have been removed.");
        return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
}));

router.put("/:id", validateCampground, catchAsync(async (req, res) => {
    await Campground.findByIdAndUpdate(req.params.id, { ...req.body.campground });

    res.redirect(`/campgrounds/${req.params.id}`)
}));


router.delete("/:id", catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect("/campgrounds")
}));



module.exports = router;