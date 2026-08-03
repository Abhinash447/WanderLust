const express = require("express");
const router = express.Router({ mergeParams: true });

// Models
const Listing = require("../models/listing");
const Review = require("../models/review");

// Utilities
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { reviewSchema } = require("../schema");

// Validation Middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }

    next();
};

// Create Review
// POST /listings/:id/reviews
router.post(
    "/",
    validateReview,
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        const newReview = new Review(req.body.review);

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        res.redirect(`/listings/${id}`);
    })
);

// Delete Review
// DELETE /listings/:id/reviews/:reviewId
router.delete(
    "/:reviewId",
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });

        await Review.findByIdAndDelete(reviewId);

        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;