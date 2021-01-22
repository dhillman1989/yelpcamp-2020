const express = require("express");
const router = express.Router();

///include env variables in production
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//CONTROLLERS
const campgrounds = require("../controllers/campgrounds");

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

router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(
    isLoggedIn,
    upload.array("images"),
    validateCampground,
    catchAsync(campgrounds.createCampground)
  );

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("images"),
    validateCampground,
    catchAsync(campgrounds.updateCampground)
  )
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
