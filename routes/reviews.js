const express = require("express");
const router = express.Router({ mergeParams: true });
const reviews = require("../controllers/reviews");

//MODELS
const { validateReview } = require("../middleware");
const Campground = require("../models/campground");
const Review = require("../models/review");

//MIDDLEWARE
//ERROR HANDLING MIDDLEWARES
const ExpressError = require("../utils/ExpressError");
const catchAsync = require("../utils/catchAsync");

//VALIDATION MIDDLEWARE

///// REVIEW ROUTES
router.post("/", validateReview, catchAsync(reviews.createReview));

router.delete("/:reviewId", catchAsync(reviews.deleteReview));

module.exports = router;
