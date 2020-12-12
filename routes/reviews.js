const express = require("express");
const router = express.Router({ mergeParams: true })

//Validation Schemas
const { reviewSchema } = require("../schemas.js");

//ERROR HANDLING MIDDLEWARES
const ExpressError = require("../utils/ExpressError")
const catchAsync = require("../utils/catchAsync")

//MODELS
const Campground = require("../models/campground");
const Review = require("../models/review");





//REVIEW VALIDATION MIDDLEWARE
const validateReview = (req, res, next) => {
    const validationResult = reviewSchema.validate(req.body);
    if (validationResult.error) {
        next(validationResult.error)
    }
    next();
}


///// REVIEW ROUTES
router.post("/", validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const reviewBody = req.body.review;

    if (!req.user) {
        console.log('no user');
        req.flash("error", "OOPS! You need to be logged in to do that.");
        return res.redirect("/login");

    }
    reviewBody.author = req.user._id;
    const campground = await Campground.findById(id);
    const review = new Review(reviewBody);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${id}`);
}));


router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`);

}));


module.exports = router;