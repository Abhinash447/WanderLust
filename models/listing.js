const mongoose = require("mongoose");
// const review = require("./review");
const Schema = mongoose.Schema;
const Review = require("./review");

const defaultLink = "https://www.namasteindiatrip.com/blog/wp-content/uploads/2024/12/Kashi-Vishwanath-Temple.jpg";

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    image: {

        filename: {
            type: String,
            default: "listingimage"
        },

        url: {
            type: String,

            default: defaultLink,

            set: (v) => v === "" ? defaultLink : v
        }
    },

    price: {
        type: Number
    },

    location: {
        type: String,
        required: true
    },

    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ]
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;