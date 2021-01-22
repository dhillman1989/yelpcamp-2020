const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");

// https://res.cloudinary.com/dave-hillman-web-developer/image/upload/w_300/v1611351993/YelpCamp/cgydysu5bpzavxyyhtsl.jpg
const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const CampgroundSchema = new Schema({
  title: String,
  price: Number,
  images: [ImageSchema],
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

//middleware to clear out related reviews from db after campground deletion
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.remove({
      _id: {
        in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
