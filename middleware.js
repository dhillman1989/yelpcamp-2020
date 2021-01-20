const { campgroundSchema } = require("./schemas.js");
const ExpressError = require("./utils/ExpressError.js");
const Campground = require("./models/campground");

const { reviewSchema } = require("./schemas.js");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    if (req.originalUrl === "/" || req.originalUrl === "/campgrounds") {
      req.session.returntTo = "/campgrounds";
    } else {
      req.session.returnTo = req.originalUrl;
    }
    req.flash("error", "Please login to access this page!");
    return res.redirect("/login");
  }
  next();
};

//CHECK IF THE CURRENTUSER MATCHES THE AUTHOR

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "Permission Denied!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};

//VALIDATION OF CAMPGROUND CREATE AND EDIT FORMS
module.exports.validateCampground = (req, res, next) => {
  const validationResult = campgroundSchema.validate(req.body);
  if (validationResult.error) {
    next(validationResult.error);
  }
  next();
};

///VALIDATE REVIEWS
module.exports.validateReview = (req, res, next) => {
  const validationResult = reviewSchema.validate(req.body);
  if (validationResult.error) {
    next(validationResult.error);
  }
  next();
};
