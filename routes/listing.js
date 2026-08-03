const express = require("express");
const router = express.Router();

// Models
const Listing = require("../models/listing");

// Utilities
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { listingSchema } = require("../schema");

// Validation Middleware
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);

    if (error) {
        const errMsg = error.details.map((el) => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    }

    next();
};

// Index Route
// GET /listings
router.get(
    "/",
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    })
);

// New Route
// GET /listings/new
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
});

// Show Route
// GET /listings/:id
router.get(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id).populate("reviews");

        res.render("listings/show.ejs", { listing });
    })
);

// Create Route
// POST /listings
router.post(
    "/",
    validateListing,
    wrapAsync(async (req, res) => {
        const newListing = new Listing(req.body.listing);

        await newListing.save();

        res.redirect("/listings");
    })
);

// Edit Route
// GET /listings/:id/edit
router.get(
    "/:id/edit",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        res.render("listings/edit.ejs", { listing });
    })
);

// Update Route
// PUT /listings/:id
router.put(
    "/:id",
    validateListing,
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        await Listing.findByIdAndUpdate(id, {
            ...req.body.listing,
        });

        res.redirect(`/listings/${id}`);
    })
);

// Delete Route
// DELETE /listings/:id
router.delete(
    "/:id",
    wrapAsync(async (req, res) => {
        const { id } = req.params;

        await Listing.findByIdAndDelete(id);

        res.redirect("/listings");
    })
);

module.exports = router;