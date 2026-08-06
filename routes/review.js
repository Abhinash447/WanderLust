const express = require("express");
const router = express.Router({ mergeParams: true });
const flash = require("connect-flash");

// Models
const Listing = require("../models/listing");
const Review = require("../models/review");
const reviewController = require("../controllers/reviews");

// Utilities
const wrapAsync = require("../utils/wrapAsync");
const { 
    validateReview, 
    isLogin,
    saveRedirectUrl, 
    isReviewAuthor 
} = require("../middleware");
const review = require("../models/review");

// Create Review
// POST /listings/:id/reviews
router.post(
    "/",
    isLogin,
    validateReview,
    wrapAsync(reviewController.createReview)
);

// Delete Review
// DELETE /listings/:id/reviews/:reviewId
router.delete(
    "/:reviewId",
    isLogin,
    isReviewAuthor,
    wrapAsync(reviewController.destroyReview)
);

module.exports = router;