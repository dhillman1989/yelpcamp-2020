const express = require("express");
const router = express.Router();

///include env variables in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//error checking
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

//models
const Campground = require("../models/campground");

//middlewares
const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");

//MULTER/cloudinary IMPORT AND CONFIG
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get("/new", isLoggedIn, (req, res) => {
  res.render("campgrounds/new");
});

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("author");
    if (!campground) {
      req.flash("error", "Campground doesn't exist! it may have been removed.");
      return res.redirect("/campgrounds");
    }
    const { reviews } = campground;
    res.render("campgrounds/show", { campground, reviews });
  })
);

router.post(
  // "/",
  // isLoggedIn,
  // validateCampground,
  // catchAsync(async (req, res, next) => {
  // if (!req.body.campground) throw new ExpressError("Invalid Data Submitted!", 400)
  //   const campground = new Campground(req.body.campground);
  //   campground.author = req.user._id;
  //   await campground.save();
  //   req.flash("success", "successfully created campground");
  // res.redirect(`/campgrounds/${campground._id}`);
  "/",
  upload.array("image"),
  (req, res) => {
    console.log(req.body, req.files);
    res.send("success");
  }
);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
      req.flash("error", "Campground doesn't exist! it may have been removed.");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;

    const campground = await Campground.findByIdAndUpdate(id, {
      ...req.body.camp,
    });
    req.flash("success", "Updated Successfully");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndRemove(id);
    res.redirect("/campgrounds");
  })
);

module.exports = router;
