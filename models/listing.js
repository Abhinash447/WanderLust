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
        url: String,
        filename: String,
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
    category: {
        type: String,
        enum: [
            "trending",
            "rooms",
            "iconic",
            "mountains",
            "castles",
            "pools",
            "camping",
            "farms",
            "arctic"
        ],
        default: "trending"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;