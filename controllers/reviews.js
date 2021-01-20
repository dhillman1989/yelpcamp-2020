const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const reviewBody = req.body.review;

  if (!req.user) {
    console.log("no user");
    req.flash("error", "OOPS! You need to be logged in to do that.");
    return res.redirect("/login");
  }
  reviewBody.author = req.user._id;
  const campground = await Campground.findById(id);
  const review = new Review(reviewBody);
  campground.reviews.push(review);
  await review.save();
  await campground.save();
  req.flash("success", "Thankyou for taking the time to leave a review!");
  res.redirect(`/campgrounds/${id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/campgrounds/${id}`);
};
