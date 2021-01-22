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
      author: "600afd350ce2560a273130b3",
      location: `${cities[rand1000].city}, ${cities[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      images: [
        {
          url:
            "https://res.cloudinary.com/dave-hillman-web-developer/image/upload/v1611332399/YelpCamp/fkbah0rvc56adapvbq61.jpg",
          filename: "YelpCamp/fkbah0rvc56adapvbq61",
        },
        {
          url:
            "https://res.cloudinary.com/dave-hillman-web-developer/image/upload/v1611332399/YelpCamp/t2ut7wvkckvhp7yewt73.jpg",
          filename: "YelpCamp/t2ut7wvkckvhp7yewt73",
        },
      ],
      description:
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores praesentium eaque maxime laborum in ullam.",
      price,
    });
    await camp.save();
  }
};

seedDb().then(() => mongoose.connection.close());
