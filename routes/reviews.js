const express = require("express");
const router = express.Router({ mergeParams: true })

//Validation Schemas
const { ReviewSchema } = require("../schemas.js");

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
    console.log(req.params);
    const { id } = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    console.log(campground);
    res.redirect(`/campgrounds/${id}`);
}))


router.delete("/:reviewId", catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`);

}));


module.exports = router;