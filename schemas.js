const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string()
      .required()
      .min(5)
      .error(new Error("Title must be a minimum of 10 characters.")),
    price: Joi.number()
      .required()
      .min(0)
      .error(new Error("Price must be provided. Minimum £0")),
    description: Joi.string()
      .required()
      .error(new Error("Description is required.")),
    location: Joi.string().required().error(new Error("Location is required")),
    // images: Joi.string()
    //   .required()
    //   .error(new Error("A valid image is required.")),
  }).required(),
  deleteImages: Joi.array(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number()
      .required()
      .min(0)
      .max(5)
      .error(new Error("A rating between 0 and 5 must be provided")),
    body: Joi.string()
      .required()
      .error(new Error("A valid review must be submitted.")),
  }).required(),
});
