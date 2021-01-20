const cities = require("./cities");
const { descriptors, places } = require("./seedHelpers");

const Campground = require("../models/campground");
const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connected!");
  })
  .catch((err) => {
    console.log(err.message);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDb = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 25; i++) {
    const rand1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 200);
    const camp = new Campground({
      author: "6006efb28dd29a93795a05f9",
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: "https://source.unsplash.com/collection/429524",
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores praesentium eaque maxime laborum in ullam.",
      price,
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
