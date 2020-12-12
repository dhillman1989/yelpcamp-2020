const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Review = require("./review");




const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    image: String,
    location: String,
    description: String,
    author: {
        type: Schema.Types.ObjectId, ref: "User"
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],

});


//middleware to clear out related reviews from db after campground deletion
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model("Campground", CampgroundSchema);