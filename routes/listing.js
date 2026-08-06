const express = require("express");
const router = express.Router();
// Models
const Listing = require("../models/listing");
// Utilities
const wrapAsync = require("../utils/wrapAsync");
const { isLogin, isOwner, validateListing } = require("../middleware");

const listingController = require("../controllers/listings");

// Index Route
// GET /listings
router.get("/", wrapAsync(listingController.index));

// New Route
// GET /listings/new
router.get("/new", isLogin, listingController.renderNewForm);

// Show Route
// GET /listings/:id
router.get("/:id",wrapAsync(listingController.showListing));

// Create Route
// POST /listings
router.post("/", isLogin, validateListing,
    wrapAsync(listingController.createListing)
);

// Edit Route
// GET /listings/:id/edit
router.get("/:id/edit", isLogin, isOwner,
    wrapAsync(listingController.editListing)
);

// Update Route
// PUT /listings/:id
router.put("/:id", isLogin, isOwner, validateListing,
    wrapAsync(listingController.updateListing)
);

// Delete Route
// DELETE /listings/:id
router.delete("/:id", isLogin, isOwner,
    wrapAsync(listingController.destroyListing)
);

module.exports = router;