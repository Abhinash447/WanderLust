const express = require("express");
const router = express.Router({ mergeParams: true });
const flash = require("connect-flash");

// Models
const Listing = require("../models/listing");
const Review = require("../models/review");

// Utilities
const wrapAsync = require("../utils/wrapAsync");
const { 
    validateReview, 
    isLogin,
    saveRedirectUrl, 
    isReviewAuthor 
} = require("../middleware");

// Create Review
// POST /listings/:id/reviews
router.post(
    "/",
    isLogin,
    validateReview,
    wrapAsync(async (req, res) => {
        const { id } = req.params;
        const listing = await Listing.findById(id);
        const newReview = new Review(req.body.review);
        newReview.author = req.user._id;
        
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();

        req.flash("success", "New Review Created")
        res.redirect(`/listings/${id}`);
    })
);

// Delete Review
// DELETE /listings/:id/reviews/:reviewId
router.delete(
    "/:reviewId",
    isLogin,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
        const { id, reviewId } = req.params;

        await Listing.findByIdAndUpdate(id, {
            $pull: { reviews: reviewId },
        });

        await Review.findByIdAndDelete(reviewId);
        req.flash("success", "Review Deleted")
        res.redirect(`/listings/${id}`);
    })
);

module.exports = router;